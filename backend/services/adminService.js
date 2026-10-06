// Rabbora Living — admin panel reads (dashboard figures, product lists).
// Only READS live here. Every change still goes through the existing
// admin endpoints (POST/PATCH /api/products, /api/products/:id/variants),
// so there is one place that writes products and one set of rules.
// Every query uses $1 parameters; nothing here is reachable without
// requireAdmin (routes/admin.js).

const db = require("../config/db");
const productService = require("./productService");
const { notFound } = require("../utils/AppError");

// ---------- dashboard ----------

// One round trip: every figure is a COUNT straight from the tables.
async function getStats() {
  const r = await db.query(
    `SELECT
       (SELECT COUNT(*) FROM products)                                         AS total_products,
       (SELECT COUNT(*) FROM products WHERE is_active = TRUE)                  AS active_products,
       (SELECT COUNT(*) FROM categories)                                       AS categories,
       (SELECT COUNT(*) FROM categories WHERE is_active = TRUE)                AS active_categories,
       (SELECT COUNT(*) FROM orders)                                           AS orders,
       (SELECT COUNT(*) FROM orders WHERE status = 'pending')                  AS pending_orders,
       (SELECT COUNT(*) FROM users WHERE role = 'customer')                    AS customers,
       (SELECT COUNT(*) FROM inventory_items
         WHERE is_active = TRUE AND stock_quantity <= low_stock_threshold)     AS low_stock_items,
       (SELECT COUNT(*) FROM reviews WHERE is_approved = FALSE)                AS pending_reviews`
  );
  const row = r.rows[0];
  const n = (v) => Number(v) || 0;
  return {
    totalProducts: n(row.total_products),
    activeProducts: n(row.active_products),
    inactiveProducts: n(row.total_products) - n(row.active_products),
    categories: n(row.categories),
    activeCategories: n(row.active_categories),
    orders: n(row.orders),
    pendingOrders: n(row.pending_orders),
    customers: n(row.customers),
    lowStockItems: n(row.low_stock_items),
    pendingReviews: n(row.pending_reviews),
  };
}

// ---------- products ----------

// Admin list: active AND inactive products, with search, category and
// status filters, one page at a time, plus the total for paging.
async function listProducts({ search, categoryId, status, featured, bestSeller, limit, offset }) {
  const where = [];
  const params = [];

  if (search) {
    params.push(`%${search.replace(/[\\%_]/g, (m) => "\\" + m)}%`);
    const i = params.length;
    where.push(`(p.name ILIKE $${i} OR p.slug ILIKE $${i} OR p.sku ILIKE $${i})`);
  }
  if (categoryId) {
    params.push(categoryId);
    where.push(`p.category_id = $${params.length}`);
  }
  if (status === "active") where.push("p.is_active = TRUE");
  if (status === "inactive") where.push("p.is_active = FALSE");
  if (featured === true) where.push("p.is_featured = TRUE");
  if (bestSeller === true) where.push("p.is_best_seller = TRUE");

  params.push(limit, offset);
  const r = await db.query(
    `SELECT p.id, p.name, p.slug, p.sku, p.price, p.main_image, p.stock_quantity,
            p.is_active, p.is_featured, p.is_best_seller, p.category_id, p.updated_at,
            c.name AS category_name, c.slug AS category_slug,
            (SELECT COUNT(*) FROM product_variants v WHERE v.product_id = p.id) AS variant_count,
            (SELECT COUNT(*) FROM product_variants v WHERE v.product_id = p.id AND v.is_active = TRUE) AS active_variant_count,
            (SELECT v.compare_at_price FROM product_variants v
              WHERE v.product_id = p.id AND v.is_active = TRUE AND v.price = p.price
              ORDER BY v.sort_order, v.id LIMIT 1) AS from_base_compare_at,
            (SELECT v.compare_at_price FROM product_variants v
              WHERE v.product_id = p.id AND v.is_active = TRUE
              ORDER BY v.sort_order, v.id LIMIT 1) AS from_first_compare_at,
            COUNT(*) OVER () AS total_count
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY p.id
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return {
    total: r.rows[0] ? Number(r.rows[0].total_count) : 0,
    products: r.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      sku: row.sku,
      price: row.price === null ? null : Number(row.price),
      mainImage: row.main_image,
      stockQuantity: row.stock_quantity,
      isActive: row.is_active,
      featured: row.is_featured,
      bestSeller: row.is_best_seller,
      category: row.category_id ? { id: row.category_id, name: row.category_name, slug: row.category_slug } : null,
      variantCount: Number(row.variant_count),
      activeVariantCount: Number(row.active_variant_count),
      // Same "from" sale / original price rule as GET /api/products.
      pricing: productService.fromPricingForListRow(row),
      updatedAt: row.updated_at,
    })),
  };
}

// Admin detail: the full product (also when inactive) plus EVERY size,
// including switched-off ones, with its stock record if it has one.
async function getProduct(id) {
  const product = await productService.getProductById(id, { includeInactive: true });
  const r = await db.query(
    `SELECT v.id, v.option_type, v.option_value, v.option_label, v.price, v.compare_at_price,
            v.stock_quantity, v.width_cm, v.length_cm, v.sort_order, v.sku, v.is_active,
            i.id AS inventory_id, i.stock_quantity AS inventory_stock,
            i.low_stock_threshold, i.is_active AS inventory_active, i.sku AS inventory_sku
       FROM product_variants v
       LEFT JOIN inventory_items i ON i.product_variant_id = v.id
      WHERE v.product_id = $1
      ORDER BY v.sort_order, v.id`,
    [id]
  );
  const variants = r.rows.map((v) => ({
    id: v.id,
    optionType: v.option_type,
    optionValue: v.option_value,
    optionLabel: v.option_label,
    price: Number(v.price),
    compareAtPrice: v.compare_at_price === null ? null : Number(v.compare_at_price),
    stockQuantity: v.stock_quantity,
    widthCm: v.width_cm,
    lengthCm: v.length_cm,
    sortOrder: v.sort_order,
    sku: v.sku,
    isActive: v.is_active,
    inventory: v.inventory_id
      ? { id: v.inventory_id, sku: v.inventory_sku, stockQuantity: v.inventory_stock, lowStockThreshold: v.low_stock_threshold, isActive: v.inventory_active }
      : null,
  }));
  // Every fabric / storage link of the product exactly as stored (also
  // switched-off ones), so the admin can rebuild the list it sends to
  // PUT /api/products/:id/fabrics | /storage-options without losing any.
  const [fabricLinks, storageLinks, productStock] = await Promise.all([
    db.query(
      `SELECT fabric_id, price_adjustment, sort_order, is_active
         FROM product_fabrics WHERE product_id = $1 ORDER BY sort_order, fabric_id`,
      [id]
    ),
    db.query(
      `SELECT storage_option_id, price_adjustment, is_default, sort_order, is_active
         FROM product_storage_options WHERE product_id = $1 ORDER BY sort_order, storage_option_id`,
      [id]
    ),
    // Whole-product stock record (no size), if one exists. Read only.
    db.query(
      `SELECT id, sku, stock_quantity, low_stock_threshold, is_active
         FROM inventory_items WHERE product_id = $1 AND product_variant_id IS NULL`,
      [id]
    ),
  ]);
  return {
    product,
    variants,
    productInventory: productStock.rows[0]
      ? {
          id: productStock.rows[0].id,
          sku: productStock.rows[0].sku,
          stockQuantity: productStock.rows[0].stock_quantity,
          lowStockThreshold: productStock.rows[0].low_stock_threshold,
          isActive: productStock.rows[0].is_active,
        }
      : null,
    fabricLinks: fabricLinks.rows.map((r) => ({
      fabricId: r.fabric_id,
      priceAdjustment: Number(r.price_adjustment),
      sortOrder: r.sort_order,
      isActive: r.is_active,
    })),
    storageLinks: storageLinks.rows.map((r) => ({
      storageOptionId: r.storage_option_id,
      priceAdjustment: Number(r.price_adjustment),
      isDefault: r.is_default,
      sortOrder: r.sort_order,
      isActive: r.is_active,
    })),
  };
}

// ---------- categories ----------

// Every category (also inactive) with product counts from the database.
async function listCategories({ search }) {
  const params = [];
  let where = "";
  if (search) {
    params.push(`%${search.replace(/[\\%_]/g, (m) => "\\" + m)}%`);
    where = "WHERE c.name ILIKE $1 OR c.slug ILIKE $1";
  }
  const r = await db.query(
    `SELECT c.id, c.name, c.slug, c.description, c.is_active, c.sort_order, c.created_at, c.updated_at,
            (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count,
            (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) AS active_product_count
       FROM categories c
      ${where}
      ORDER BY c.sort_order, c.name, c.id`,
    params
  );
  return r.rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    productCount: Number(row.product_count),
    activeProductCount: Number(row.active_product_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

// ---------- fabrics / storage options ----------

function likeParam(params, search) {
  params.push(`%${search.replace(/[\\%_]/g, (m) => "\\" + m)}%`);
  return `$${params.length}`;
}

// Every fabric (also inactive) with how many products offer it.
async function listFabrics({ search, status }) {
  const params = [];
  const where = [];
  if (search) {
    const p = likeParam(params, search);
    where.push(`(f.name ILIKE ${p} OR f.slug ILIKE ${p} OR f.collection ILIKE ${p})`);
  }
  if (status === "active") where.push("f.is_active = TRUE");
  if (status === "inactive") where.push("f.is_active = FALSE");
  const r = await db.query(
    `SELECT f.*,
            (SELECT COUNT(*) FROM product_fabrics pf WHERE pf.fabric_id = f.id) AS product_count
       FROM fabrics f
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY f.collection NULLS LAST, f.sort_order, f.name, f.id`,
    params
  );
  return r.rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    collection: row.collection,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    productCount: Number(row.product_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

// Every storage option (also inactive) with how many products offer it.
async function listStorageOptions() {
  const r = await db.query(
    `SELECT s.*,
            (SELECT COUNT(*) FROM product_storage_options ps WHERE ps.storage_option_id = s.id) AS product_count,
            (SELECT COUNT(*) FROM product_storage_options ps WHERE ps.storage_option_id = s.id AND ps.is_default = TRUE) AS default_count
       FROM storage_options s
      ORDER BY s.sort_order, s.name, s.id`
  );
  return r.rows.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    productCount: Number(row.product_count),
    defaultCount: Number(row.default_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

// Products that offer one fabric / storage option (for the mapping screen).
async function optionProducts(kind, optionId) {
  const isFabric = kind === "fabric";
  const table = isFabric ? "fabrics" : "storage_options";
  const exists = await db.query(`SELECT id FROM ${table} WHERE id = $1`, [optionId]);
  if (!exists.rows[0]) throw notFound(isFabric ? "Fabric not found." : "Storage option not found.");
  const r = await db.query(
    isFabric
      ? `SELECT l.product_id, l.price_adjustment, l.is_active, FALSE AS is_default, p.name, p.category_id
           FROM product_fabrics l JOIN products p ON p.id = l.product_id
          WHERE l.fabric_id = $1 ORDER BY p.name`
      : `SELECT l.product_id, l.price_adjustment, l.is_active, l.is_default, p.name, p.category_id
           FROM product_storage_options l JOIN products p ON p.id = l.product_id
          WHERE l.storage_option_id = $1 ORDER BY p.name`,
    [optionId]
  );
  return r.rows.map((row) => ({
    productId: row.product_id,
    name: row.name,
    categoryId: row.category_id,
    priceAdjustment: Number(row.price_adjustment),
    isDefault: row.is_default,
    isActive: row.is_active,
  }));
}

// ---------- inventory ----------

// One list for the Inventory page: every stock record (product-level or
// size-level, active or switched off) plus every product that has NO
// active record, i.e. is not stock-limited ("not tracked").
// The low-stock rule is the existing one: stock <= low_stock_threshold.
async function listInventory({ search, filter, limit, offset }) {
  const params = [];
  let searchSql = "TRUE";
  if (search) {
    // Case- and space-insensitive: the search text and every field are
    // lowercased with ALL whitespace removed before comparing, so
    // "1000 Cool Gel Mattress", "1000 CoolGel Mattress", "coolgel" and
    // "MATTRESS" all find "1000 CoolGel Mattress".
    const compact = search.toLowerCase().replace(/\s+/g, "");
    const p = likeParam(params, compact);
    const norm = (col) => `regexp_replace(lower(coalesce(${col}, '')), '\\s+', '', 'g')`;
    searchSql = `(${norm("u.product_name")} LIKE ${p} OR ${norm("u.sku")} LIKE ${p}
                  OR ${norm("u.product_sku")} LIKE ${p} OR ${norm("u.size_label")} LIKE ${p})`;
  }
  const filters = {
    all: "TRUE",
    low: "u.tracked AND u.is_active AND u.stock_quantity <= u.low_stock_threshold",
    out: "u.tracked AND u.is_active AND u.stock_quantity = 0",
    tracked: "u.tracked",
    untracked: "NOT u.tracked",
  };
  const filterSql = filters[filter] || filters.all;
  params.push(limit, offset);
  const r = await db.query(
    `WITH units AS (
       SELECT TRUE AS tracked, i.id AS inventory_id, i.product_id, i.product_variant_id,
              p.name AS product_name, p.sku AS product_sku, p.is_active AS product_active, p.main_image,
              v.option_label AS size_label, v.is_active AS variant_active,
              i.sku, i.stock_quantity, i.low_stock_threshold, i.is_active, i.updated_at,
              (SELECT COUNT(*) FROM product_variants pv WHERE pv.product_id = p.id) AS variant_count
         FROM inventory_items i
         JOIN products p ON p.id = i.product_id
         LEFT JOIN product_variants v ON v.id = i.product_variant_id
       UNION ALL
       SELECT FALSE, NULL, p.id, NULL,
              p.name, p.sku, p.is_active, p.main_image,
              NULL, NULL,
              NULL, NULL, NULL, NULL, p.updated_at,
              (SELECT COUNT(*) FROM product_variants pv WHERE pv.product_id = p.id)
         FROM products p
        WHERE NOT EXISTS (SELECT 1 FROM inventory_items i WHERE i.product_id = p.id AND i.is_active = TRUE)
     )
     SELECT u.*, COUNT(*) OVER () AS total_count
       FROM units u
      WHERE ${searchSql} AND ${filterSql}
      ORDER BY u.product_name, u.product_id, u.tracked DESC, u.product_variant_id NULLS FIRST
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const totals = await db.query(
    `SELECT COUNT(*) FILTER (WHERE is_active) AS tracked,
            COUNT(*) FILTER (WHERE is_active AND stock_quantity <= low_stock_threshold) AS low,
            COUNT(*) FILTER (WHERE is_active AND stock_quantity = 0) AS out,
            (SELECT COUNT(*) FROM products p WHERE NOT EXISTS
               (SELECT 1 FROM inventory_items i WHERE i.product_id = p.id AND i.is_active = TRUE)) AS untracked
       FROM inventory_items`
  );
  const t = totals.rows[0];
  return {
    total: r.rows[0] ? Number(r.rows[0].total_count) : 0,
    summary: { tracked: Number(t.tracked), low: Number(t.low), out: Number(t.out), untracked: Number(t.untracked) },
    items: r.rows.map((u) => ({
      tracked: u.tracked,
      inventoryId: u.inventory_id,
      level: !u.tracked ? "none" : u.product_variant_id ? "variant" : "product",
      productId: u.product_id,
      productName: u.product_name,
      productActive: u.product_active,
      productSku: u.product_sku,
      mainImage: u.main_image,
      variantCount: Number(u.variant_count),
      productVariantId: u.product_variant_id,
      sizeLabel: u.size_label,
      variantActive: u.variant_active,
      sku: u.sku,
      stockQuantity: u.stock_quantity,
      lowStockThreshold: u.low_stock_threshold,
      isActive: u.is_active,
      lowStock: u.tracked ? u.stock_quantity <= u.low_stock_threshold : false,
      outOfStock: u.tracked ? u.stock_quantity === 0 : false,
      updatedAt: u.updated_at,
    })),
  };
}

// ---------- shared search helper (orders, customers, reviews) ----------

// Case- and space-insensitive "contains" on several columns: the search
// text and each column are lowercased with all whitespace removed, so
// "rb261003 - 1000", "Amina  Afzal" or "AMINA@EXAMPLE.COM" still match.
function compactSearch(params, search, columns) {
  const compact = search.toLowerCase().replace(/\s+/g, "");
  const p = likeParam(params, compact);
  return "(" + columns.map((col) => `regexp_replace(lower(coalesce(${col}::text, '')), '\\s+', '', 'g') LIKE ${p}`).join(" OR ") + ")";
}

// ---------- orders ----------

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"];

// Admin order list: search (number / customer name / email), status and
// payment filters, pages, plus a count per status for the summary cards.
async function listOrders({ search, status, paymentStatus, limit, offset }) {
  const params = [];
  const where = [];
  if (search) where.push(compactSearch(params, search, ["o.order_number", "o.customer_name", "o.customer_email"]));
  if (ORDER_STATUSES.includes(status)) { params.push(status); where.push(`o.status = $${params.length}`); }
  if (PAYMENT_STATUSES.includes(paymentStatus)) { params.push(paymentStatus); where.push(`o.payment_status = $${params.length}`); }
  params.push(limit, offset);
  const r = await db.query(
    `SELECT o.id, o.order_number, o.user_id, o.status, o.payment_status, o.subtotal, o.shipping, o.total,
            o.customer_name, o.customer_email, o.created_at, o.updated_at,
            (SELECT COALESCE(SUM(i.quantity), 0) FROM order_items i WHERE i.order_id = o.id) AS item_count,
            (SELECT COUNT(*) FROM order_items i WHERE i.order_id = o.id) AS line_count,
            COUNT(*) OVER () AS total_count
       FROM orders o
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY o.created_at DESC, o.id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const counts = await db.query(
    `SELECT COUNT(*) AS total,
            COUNT(*) FILTER (WHERE status = 'pending') AS pending,
            COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed,
            COUNT(*) FILTER (WHERE status = 'processing') AS processing,
            COUNT(*) FILTER (WHERE status = 'shipped') AS shipped,
            COUNT(*) FILTER (WHERE status = 'delivered') AS delivered,
            COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
            COUNT(*) FILTER (WHERE status = 'refunded') AS refunded
       FROM orders`
  );
  const c = counts.rows[0];
  const summary = {};
  Object.keys(c).forEach((k) => { summary[k] = Number(c[k]); });
  return {
    total: r.rows[0] ? Number(r.rows[0].total_count) : 0,
    summary,
    orders: r.rows.map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      userId: o.user_id,
      status: o.status,
      paymentStatus: o.payment_status,
      subtotal: Number(o.subtotal),
      shipping: Number(o.shipping),
      total: Number(o.total),
      customer: { name: o.customer_name, email: o.customer_email },
      itemCount: Number(o.item_count),
      lineCount: Number(o.line_count),
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    })),
  };
}

// ---------- customers ----------

// "Total spent" counts orders that are not cancelled or refunded.
const SPENT_SQL = `COALESCE(SUM(o.total) FILTER (WHERE o.status NOT IN ('cancelled', 'refunded')), 0)`;

// Accounts with order count / total spent. role: customer (default) | admin | all.
// Never selects password_hash.
async function listCustomers({ search, role, status, limit, offset }) {
  const params = [];
  const where = [];
  if (role === "customer" || role === "admin") { params.push(role); where.push(`u.role = $${params.length}`); }
  if (status === "active") where.push("u.is_active = TRUE");
  if (status === "inactive") where.push("u.is_active = FALSE");
  if (search) where.push(compactSearch(params, search, ["u.first_name || ' ' || u.last_name", "u.email", "u.phone"]));
  params.push(limit, offset);
  const r = await db.query(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.role, u.is_active, u.created_at,
            COUNT(o.id) AS order_count, ${SPENT_SQL} AS total_spent,
            COUNT(*) OVER () AS total_count
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      GROUP BY u.id
      ORDER BY u.created_at DESC, u.id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const sum = await db.query(
    `SELECT COUNT(*) FILTER (WHERE role = 'customer') AS customers,
            COUNT(*) FILTER (WHERE role = 'customer' AND is_active) AS active,
            COUNT(*) FILTER (WHERE role = 'customer' AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days') AS new_30_days,
            (SELECT COUNT(DISTINCT o.user_id) FROM orders o JOIN users cu ON cu.id = o.user_id WHERE cu.role = 'customer') AS with_orders,
            COUNT(*) FILTER (WHERE role = 'admin') AS admins
       FROM users`
  );
  const s = sum.rows[0];
  return {
    total: r.rows[0] ? Number(r.rows[0].total_count) : 0,
    summary: { customers: Number(s.customers), active: Number(s.active), withOrders: Number(s.with_orders), new30Days: Number(s.new_30_days), admins: Number(s.admins) },
    customers: r.rows.map((u) => ({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      name: `${u.first_name} ${u.last_name}`,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isActive: u.is_active,
      createdAt: u.created_at,
      orderCount: Number(u.order_count),
      totalSpent: Number(u.total_spent),
    })),
  };
}

// One account: profile (no password data), addresses, order totals,
// recent orders, wishlist and review counts.
async function getCustomer(id) {
  const u = await db.query(
    `SELECT id, first_name, last_name, email, phone, role, is_active, created_at, updated_at FROM users WHERE id = $1`,
    [id]
  );
  if (!u.rows[0]) throw notFound("Customer not found.");
  const user = u.rows[0];
  const [addresses, stats, recent, wishlist, reviews] = await Promise.all([
    db.query("SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id", [id]),
    db.query(`SELECT COUNT(*) AS order_count, ${SPENT_SQL} AS total_spent FROM orders o WHERE o.user_id = $1`, [id]),
    db.query(
      `SELECT id, order_number, status, payment_status, total, created_at
         FROM orders WHERE user_id = $1 ORDER BY created_at DESC, id DESC LIMIT 10`,
      [id]
    ),
    db.query("SELECT COUNT(*) AS n FROM wishlist_items WHERE user_id = $1", [id]),
    db.query("SELECT COUNT(*) AS n, COUNT(*) FILTER (WHERE is_approved) AS approved FROM reviews WHERE user_id = $1", [id]),
  ]);
  const userService = require("./userService");
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    addresses: addresses.rows.map(userService.formatAddress),
    orderCount: Number(stats.rows[0].order_count),
    totalSpent: Number(stats.rows[0].total_spent),
    recentOrders: recent.rows.map((o) => ({
      id: o.id, orderNumber: o.order_number, status: o.status, paymentStatus: o.payment_status,
      total: Number(o.total), createdAt: o.created_at,
    })),
    wishlistCount: Number(wishlist.rows[0].n),
    reviewCount: Number(reviews.rows[0].n),
    approvedReviewCount: Number(reviews.rows[0].approved),
  };
}

// ---------- reviews ----------

function formatAdminReview(r) {
  return {
    id: r.id,
    productId: r.product_id,
    productName: r.product_name,
    productSlug: r.product_slug,
    categorySlug: r.category_slug,
    userId: r.user_id,
    customerName: `${r.first_name} ${r.last_name}`,
    customerEmail: r.email,
    rating: r.rating,
    title: r.title,
    body: r.body,
    isApproved: r.is_approved,
    status: r.is_approved ? "approved" : "pending",
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

const REVIEW_SELECT = `SELECT rv.*, p.name AS product_name, p.slug AS product_slug, c.slug AS category_slug,
                              u.first_name, u.last_name, u.email
                         FROM reviews rv
                         JOIN products p ON p.id = rv.product_id
                         LEFT JOIN categories c ON c.id = p.category_id
                         JOIN users u ON u.id = rv.user_id`;

// Every review (visible and hidden), search on product / customer / text.
// New customer reviews are published straight away. The reviews table
// only has is_approved, so the API statuses are "approved" (visible in
// the shop) and "pending" (hidden by an admin).
async function listReviews({ search, status, limit, offset }) {
  const params = [];
  const where = [];
  if (status === "approved") where.push("rv.is_approved = TRUE");
  if (status === "pending") where.push("rv.is_approved = FALSE");
  if (search) {
    where.push(compactSearch(params, search, ["p.name", "u.first_name || ' ' || u.last_name", "u.email", "rv.title", "rv.body"]));
  }
  params.push(limit, offset);
  const r = await db.query(
    `${REVIEW_SELECT.replace("SELECT rv.*,", "SELECT rv.*, COUNT(*) OVER () AS total_count,")}
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY rv.created_at DESC, rv.id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  const sum = await db.query(
    `SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_approved) AS approved,
            COUNT(*) FILTER (WHERE NOT is_approved) AS pending FROM reviews`
  );
  const s = sum.rows[0];
  return {
    total: r.rows[0] ? Number(r.rows[0].total_count) : 0,
    summary: { total: Number(s.total), approved: Number(s.approved), pending: Number(s.pending) },
    reviews: r.rows.map(formatAdminReview),
  };
}

async function getReview(id) {
  const r = await db.query(`${REVIEW_SELECT} WHERE rv.id = $1`, [id]);
  if (!r.rows[0]) throw notFound("Review not found.");
  return formatAdminReview(r.rows[0]);
}

module.exports = {
  getStats, listProducts, getProduct, listCategories, listFabrics, listStorageOptions, optionProducts, listInventory,
  listOrders, listCustomers, getCustomer, listReviews, getReview,
};