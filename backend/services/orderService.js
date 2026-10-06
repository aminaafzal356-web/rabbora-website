// Rabbora Living — orders (no payment yet: Stripe comes later).
//
// Placing an order turns the customer's database cart into an order in
// ONE transaction:
//   1. every cart line is checked again (product active, size active,
//      price still correct — same rules as Add to Basket),
//   2. tracked stock is checked and taken off,
//   3. the order and its lines are saved as SNAPSHOTS (name, size,
//      fabric, storage, unit price, address), so later price or product
//      changes never change an existing order,
//   4. the cart is emptied.
// If anything fails, nothing is saved and the cart is left as it was.

const db = require("../config/db");
const { withTransaction } = require("../utils/transaction");
const { toPence, fromPence, penceToNumeric, CURRENCY } = require("../utils/pricing");
const { AppError, notFound, badRequest, forbidden, conflict } = require("../utils/AppError");
const { checkUnitPrice } = require("../routes/cart");
const userService = require("./userService");

// Free Mainland UK delivery (as the site says). Can be changed in .env
// with SHIPPING_FLAT_GBP=… (pounds), without code changes.
function shippingPence() {
  const pence = toPence(process.env.SHIPPING_FLAT_GBP || 0);
  return pence !== null && pence >= 0 ? pence : 0;
}

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"];

// ---------- formatting ----------

function formatItem(r) {
  return {
    id: r.id,
    productId: r.product_id,
    productVariantId: r.product_variant_id,
    productName: r.product_name,
    productSlug: r.product_slug,
    selectedSize: r.selected_size,
    selectedFabric: r.selected_fabric,
    selectedStorage: r.selected_storage,
    options: r.options,
    image: r.image,
    quantity: r.quantity,
    unitPrice: Number(r.unit_price),
    totalPrice: Number(r.total_price),
  };
}

function formatOrder(r, items) {
  return {
    id: r.id,
    orderNumber: r.order_number,
    userId: r.user_id,
    status: r.status,
    paymentStatus: r.payment_status,
    currency: r.currency,
    subtotal: Number(r.subtotal),
    shipping: Number(r.shipping),
    discount: Number(r.discount),
    total: Number(r.total),
    customer: { email: r.customer_email, name: r.customer_name, phone: r.customer_phone },
    shippingAddress: r.shipping_address,
    billingAddress: r.billing_address,
    notes: r.notes,
    items: items ? items.map(formatItem) : undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// Address object stored inside the order (a copy, not a link).
function addressSnapshot(a) {
  return {
    fullName: a.fullName,
    phone: a.phone,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 || null,
    city: a.city,
    county: a.county || null,
    postcode: a.postcode,
    country: a.country || "United Kingdom",
  };
}

function optionText(options, ...keys) {
  for (const key of keys) {
    const v = options && options[key];
    if (v !== undefined && v !== null && v !== "") return String(v).slice(0, 150);
  }
  return null;
}

// ---------- place an order ----------

async function placeOrder(user, input) {
  return withTransaction(async (client) => {
    // Addresses: a saved address (by id) or one typed at checkout.
    const shipping = input.shippingAddressId
      ? await userService.getAddress(user.id, input.shippingAddressId, client)
      : input.shippingAddress;
    if (!shipping) throw badRequest("A shipping address is required.");
    const billing = input.billingAddressId
      ? await userService.getAddress(user.id, input.billingAddressId, client)
      : input.billingAddress || shipping;

    // 1. The cart and its lines, locked so they cannot change meanwhile.
    const cartResult = await client.query(
      `SELECT c.id FROM carts c JOIN users u ON u.id = c.user_id
        WHERE c.user_id = $1 AND u.is_active = TRUE FOR UPDATE OF c`,
      [user.id]
    );
    const cart = cartResult.rows[0];
    if (!cart) throw new AppError(400, "INVALID_ORDER", "Your basket is empty.");

    const linesResult = await client.query(
      `SELECT ci.*, p.name AS product_name, p.slug AS product_slug, p.price AS product_price,
              p.is_active AS product_active,
              v.price AS variant_price, v.option_label AS variant_label, v.is_active AS variant_active
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         LEFT JOIN product_variants v ON v.id = ci.product_variant_id
        WHERE ci.cart_id = $1
        ORDER BY ci.created_at, ci.id
        FOR UPDATE OF ci`,
      [cart.id]
    );
    const lines = linesResult.rows;
    if (!lines.length) throw new AppError(400, "INVALID_ORDER", "Your basket is empty.");

    // Active size prices per product (for lines without a size).
    const productIds = [...new Set(lines.map((l) => l.product_id))];
    const sizePrices = await client.query(
      "SELECT product_id, price FROM product_variants WHERE product_id = ANY($1::int[]) AND is_active = TRUE",
      [productIds]
    );
    const pricesByProduct = new Map();
    for (const row of sizePrices.rows) {
      if (!pricesByProduct.has(row.product_id)) pricesByProduct.set(row.product_id, []);
      pricesByProduct.get(row.product_id).push(row.price);
    }

    // 2. Re-check every line.
    for (const line of lines) {
      if (!line.product_active) {
        throw conflict("INVALID_CART_ITEM", `"${line.name}" is no longer available. Please remove it from your basket.`);
      }
      if (line.product_variant_id && !line.variant_active) {
        throw conflict("INVALID_VARIANT", `The size chosen for "${line.name}" is no longer available.`);
      }
      const ok = checkUnitPrice(
        { unitPrice: Number(line.unit_price), options: line.options || {}, frontendId: line.frontend_product_id },
        { price: line.product_price },
        line.product_variant_id ? { price: line.variant_price } : null,
        pricesByProduct.get(line.product_id) || []
      );
      if (!ok) {
        throw conflict("PRICE_CHANGED", `The price of "${line.name}" has changed. Please refresh your basket and try again.`);
      }
    }

    // 3. Tracked stock: a size row wins over a product row.
    const variantIds = lines.map((l) => l.product_variant_id).filter(Boolean);
    const invResult = await client.query(
      `SELECT id, product_id, product_variant_id, stock_quantity
         FROM inventory_items
        WHERE is_active = TRUE
          AND (product_variant_id = ANY($1::int[])
               OR (product_variant_id IS NULL AND product_id = ANY($2::int[])))
        FOR UPDATE`,
      [variantIds, productIds]
    );
    const byVariant = new Map();
    const byProduct = new Map();
    for (const inv of invResult.rows) {
      if (inv.product_variant_id) byVariant.set(inv.product_variant_id, inv);
      else byProduct.set(inv.product_id, inv);
    }
    const needed = new Map(); // inventory id -> quantity
    for (const line of lines) {
      const inv = (line.product_variant_id && byVariant.get(line.product_variant_id)) || byProduct.get(line.product_id);
      line.inventory = inv || null;
      if (inv) needed.set(inv.id, (needed.get(inv.id) || 0) + line.quantity);
    }
    for (const inv of invResult.rows) {
      const qty = needed.get(inv.id) || 0;
      if (qty > inv.stock_quantity) {
        const line = lines.find((l) => l.inventory && l.inventory.id === inv.id);
        throw conflict(
          "INSUFFICIENT_STOCK",
          inv.stock_quantity > 0
            ? `Only ${inv.stock_quantity} of "${line.name}" left in stock.`
            : `"${line.name}" is out of stock.`
        );
      }
    }
    for (const [invId, qty] of needed) {
      await client.query(
        "UPDATE inventory_items SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [qty, invId]
      );
    }

    // 4. Totals in whole pence.
    const subtotal = lines.reduce((sum, l) => sum + toPence(l.unit_price) * l.quantity, 0);
    const ship = shippingPence();
    const discount = 0;
    const total = subtotal + ship - discount;

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, currency, subtotal, shipping, discount, total,
                           customer_email, customer_name, customer_phone,
                           shipping_address, billing_address, notes)
       VALUES ('RB' || to_char(CURRENT_DATE, 'YYMMDD') || '-' || nextval('order_number_seq'),
               $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12)
       RETURNING *`,
      [
        user.id,
        CURRENCY,
        penceToNumeric(subtotal),
        penceToNumeric(ship),
        penceToNumeric(discount),
        penceToNumeric(total),
        user.email,
        `${user.firstName} ${user.lastName}`,
        user.phone || null,
        JSON.stringify(addressSnapshot(shipping)),
        JSON.stringify(addressSnapshot(billing)),
        input.notes || null,
      ]
    );
    const order = orderResult.rows[0];

    const items = [];
    for (const line of lines) {
      const unit = toPence(line.unit_price);
      const r = await client.query(
        `INSERT INTO order_items (order_id, product_id, product_variant_id, frontend_product_id,
                                  product_name, product_slug, selected_size, selected_fabric,
                                  selected_storage, options, image, inventory_item_id,
                                  quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          order.id,
          line.product_id,
          line.product_variant_id,
          line.frontend_product_id,
          line.name,
          line.product_slug,
          optionText(line.options, "size", "width") || line.variant_label || null,
          optionText(line.options, "fabric"),
          optionText(line.options, "ottomanStorage", "storage"),
          JSON.stringify(line.options || {}),
          line.image,
          line.inventory ? line.inventory.id : null,
          line.quantity,
          penceToNumeric(unit),
          penceToNumeric(unit * line.quantity),
        ]
      );
      items.push(r.rows[0]);
    }

    // 5. Empty the cart.
    await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);
    await client.query("UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1", [cart.id]);

    return formatOrder(order, items);
  });
}

// ---------- reading ----------

async function listOrders({ userId, status, limit, offset }) {
  const where = [];
  const params = [];
  if (userId) { params.push(userId); where.push(`user_id = $${params.length}`); }
  if (status) { params.push(status); where.push(`status = $${params.length}`); }
  params.push(limit, offset);
  const r = await db.query(
    `SELECT *, COUNT(*) OVER () AS total_count FROM orders
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return { total: r.rows[0] ? Number(r.rows[0].total_count) : 0, orders: r.rows.map((row) => formatOrder(row)) };
}

async function getOrder(user, id) {
  const r = await db.query("SELECT * FROM orders WHERE id = $1", [id]);
  const order = r.rows[0];
  // Someone else's order looks exactly like a missing one.
  if (!order || (order.user_id !== user.id && user.role !== "admin")) throw notFound("Order not found.");
  const items = await db.query("SELECT * FROM order_items WHERE order_id = $1 ORDER BY id", [id]);
  return formatOrder(order, items.rows);
}

// ---------- changing status ----------

// Puts back the stock an order took (only lines that took stock).
async function restock(client, orderId) {
  await client.query(
    `UPDATE inventory_items i
        SET stock_quantity = i.stock_quantity + s.qty, updated_at = CURRENT_TIMESTAMP
       FROM (SELECT inventory_item_id, SUM(quantity) AS qty FROM order_items
              WHERE order_id = $1 AND inventory_item_id IS NOT NULL
              GROUP BY inventory_item_id) s
      WHERE i.id = s.inventory_item_id`,
    [orderId]
  );
}

// Customer: cancel own order while it is still pending and unpaid.
async function cancelOwnOrder(user, id) {
  await withTransaction(async (client) => {
    const r = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [id]);
    const order = r.rows[0];
    if (!order || order.user_id !== user.id) throw notFound("Order not found.");
    if (order.status !== "pending" || order.payment_status !== "unpaid") {
      throw new AppError(400, "INVALID_ORDER", "This order can no longer be cancelled online. Please contact us.");
    }
    await client.query("UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
    await restock(client, id);
  });
  return getOrder(user, id);
}

// Admin: change status and/or payment status.
async function adminUpdateOrder(user, id, d) {
  if (user.role !== "admin") throw forbidden();
  await withTransaction(async (client) => {
    const r = await client.query("SELECT * FROM orders WHERE id = $1 FOR UPDATE", [id]);
    const order = r.rows[0];
    if (!order) throw notFound("Order not found.");
    const sets = [];
    const params = [];
    if (d.status !== undefined) { params.push(d.status); sets.push(`status = $${params.length}`); }
    if (d.paymentStatus !== undefined) { params.push(d.paymentStatus); sets.push(`payment_status = $${params.length}`); }
    if (!sets.length) throw badRequest("Nothing to update.");
    params.push(id);
    await client.query(`UPDATE orders SET ${sets.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${params.length}`, params);

    const wasClosed = ["cancelled", "refunded"].includes(order.status);
    const nowClosed = ["cancelled", "refunded"].includes(d.status);
    if (nowClosed && !wasClosed) await restock(client, id);
    if (wasClosed && d.status && !nowClosed) {
      throw new AppError(400, "INVALID_ORDER", "A cancelled or refunded order cannot be reopened.");
    }
  });
  return getOrder(user, id);
}

module.exports = { placeOrder, listOrders, getOrder, cancelOwnOrder, adminUpdateOrder, STATUSES, PAYMENT_STATUSES, fromPence };