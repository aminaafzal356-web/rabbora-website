// Rabbora Living — cart API (logged-in customers only)
// GET    /api/cart            — the customer's cart with all its lines
//                               (the cart is created if it does not exist yet)
// POST   /api/cart/items      — add a line, or add to the quantity of the
//                               same line (same line_key) if it is already there
// PATCH  /api/cart/items/:id  — set the quantity of one line
// DELETE /api/cart/items/:id  — remove one line
// DELETE /api/cart            — remove every line (the cart itself stays)
//
// How a cart line is identified (same as the frontend cart, cart-data.js):
// - line_key is the frontend lineId, sent by the page and stored exactly
//   as sent. It is NOT rebuilt here; it is only CHECKED against
//   frontend_product_id + options with the same rule as
//   RabboraCart.buildLineId(), so a line_key can never hide different
//   options (e.g. another fabric) and merge two different lines.
// - UNIQUE (cart_id, line_key) in the database: the same line added again
//   raises the quantity and keeps the first unit_price; a line that
//   differs in anything (fabric, assembly, custom request, delivery date,
//   page id, ...) is a separate row.
//
// Security rules followed here:
// - The customer is always taken from the login session
//   (getSessionUserId, the same check as GET /api/me). A user_id sent by
//   the browser is ignored.
// - Every query only touches the logged-in customer's own cart.
// - Every query uses $1, $2 ... parameters (no SQL built from input).
// - Prices are checked against PostgreSQL (see checkUnitPrice below).
// - Database errors are logged on the server only; the customer always
//   gets a short, safe message.
//
// Products that are not in the database (TV Beds 5-12, the Blanket
// Boxes, rapid-14, rapid-24) cannot be added: product_id must be a real,
// active product. They stay in the browser (localStorage) cart for now.

const express = require("express");
const db = require("../config/db");
const { getSessionUserId, destroySession, clearSessionCookie } = require("../config/session");

const router = express.Router();

// ---------- Limits ----------

const MAX_QUANTITY = 999; // per line; a safety limit against typing errors/abuse
const MAX_PRICE = 99999999.99; // NUMERIC(10,2)
const MAX_FRONTEND_ID = 255;
const MAX_LINE_KEY_BYTES = 2500; // same limit as the database check
const MAX_NAME = 255;
const MAX_TEXT = 1000; // url, image, alt, category, fabric_image
const MAX_OPTION_TEXT = 255;
const MAX_CUSTOM_REQUEST = 500; // same as the textarea maxlength on the pages
const MAX_ID = 2147483647; // PostgreSQL INTEGER

// ---------- Existing frontend price rules (not new rules) ----------
// Every product page calculates:  unit price = size price + add-ons.
// - Assembly: +£59 when "assembly" is "yes" (ASSEMBLY_PRICE = 59 on
//   every bed page).
// - Detailing buttons: +£15 on the Slatted Ottoman Beds page only
//   (ottoman-beds.js: detailingButtonsPrice, 15 for every product).
//   Diamantes, and buttons on other pages, are free.
// Nothing else changes the price.
const ASSEMBLY_PRICE_PENCE = 5900;
const OTTOMAN_BUTTONS_PRICE_PENCE = 1500;
const OTTOMAN_PAGE_ID_PREFIX = "ottoman-bed-";

// The only keys the frontend puts in a cart line's "variant" object
// (checked in every Add to Basket handler), in the order the pages send
// them. Anything else is refused.
// PostgreSQL JSONB does not keep key order, but the cart page lists the
// options in the order they are stored ("Size: ... Fabric: ..."), so
// options are always returned in this order. Every page sends its keys
// in this same relative order (e.g. mattresses: size, dimensions,
// firmness; blanket boxes: width, fabric), so each page's own order is
// kept exactly. line_key is not affected: buildLineId sorts the keys.
const OPTION_ORDER = [
  "size",
  "width",
  "dimensions",
  "firmness",
  "fabric",
  "fabricSlug",
  "fabricImage",
  "diamantes",
  "buttons",
  "ottomanStorage",
  "footstoolBlanketBox",
  "footstoolBlanketBoxType",
  "headboardHeight",
  "customRequest",
  "assembly",
  "assemblyPrice",
  "deliveryDelay",
  "deliveryDate",
  "requiredDeliveryDate",
];
const OPTION_KEYS = new Set(OPTION_ORDER);

// ---------- Messages ----------

const MSG_NOT_LOGGED_IN = "Please log in to use your cart.";
const MSG_ITEM_NOT_FOUND = "Cart item not found.";
const MSG_PRODUCT_UNAVAILABLE = "This product is not available.";
const MSG_VARIANT_UNAVAILABLE = "This size is not available for this product.";
const MSG_PRICE_CHANGED = "The price of this item has changed. Please refresh the page and try again.";
const MSG_LOAD_ERROR = "We couldn't load your cart right now. Please try again later.";
const MSG_SAVE_ERROR = "We couldn't update your cart right now. Please try again later.";

// ---------- Small helpers ----------

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isPositiveId(value) {
  return Number.isInteger(value) && value > 0 && value <= MAX_ID;
}

// "/api/cart/items/12" -> 12. Anything else (e.g. "12abc", "-1") -> null.
function parseIdParam(value) {
  if (typeof value !== "string" || !/^[1-9][0-9]{0,9}$/.test(value)) return null;
  const id = Number(value);
  return id <= MAX_ID ? id : null;
}

// £ amounts are compared in whole pence so 306.59 + 59 never suffers
// from floating-point rounding.
function toPence(value) {
  return Math.round(Number(value) * 100);
}

// NUMERIC -> number (e.g. "999.00" -> 999). NULL stays null.
function toPrice(value) {
  return value === null || value === undefined ? null : Number(value);
}

// Optional text field: missing/null/"" -> null, otherwise a string no
// longer than `max`. Returns { ok, value } so callers can report errors.
function optionalText(value, max) {
  if (value === undefined || value === null || value === "") return { ok: true, value: null };
  if (typeof value !== "string" || value.length > max) return { ok: false };
  return { ok: true, value };
}

// A page link or image path from our own site, e.g.
// "tv-beds.html#/tv-bed-1" or "tv/img-1.jfif". Refuses anything that could
// run script or leave the site when used in href/src ("javascript:",
// "https://...", "//evil.example", quotes or angle brackets).
function isSafeRelativePath(value) {
  return (
    typeof value === "string" &&
    !value.includes(":") &&
    !value.startsWith("//") &&
    !/[<>"'`\\\s]/.test(value.replace(/ /g, "")) // spaces allowed, other whitespace not
  );
}

// Same rule as RabboraCart.buildLineId() in cart-data.js:
// id + "::" + every option whose value is not null/undefined/"",
// written key:value, keys sorted A-Z, joined with "|".
function buildLineId(productId, variant) {
  const base = String(productId);
  if (!variant) return base;

  const keys = Object.keys(variant).filter((key) => {
    const value = variant[key];
    return value !== null && value !== undefined && value !== "";
  });
  if (keys.length === 0) return base;

  keys.sort();
  return base + "::" + keys.map((key) => key + ":" + String(variant[key])).join("|");
}

// Options in the frontend's own key order (see OPTION_ORDER).
function orderOptions(options) {
  const ordered = {};
  if (!isPlainObject(options)) return ordered;
  for (const key of OPTION_ORDER) {
    if (Object.prototype.hasOwnProperty.call(options, key)) ordered[key] = options[key];
  }
  return ordered;
}

// ---------- Login check ----------

// Every cart route needs a logged-in customer. Uses the same session
// check as GET /api/me (including the 1-day / 30-day limit). An expired
// session is removed, exactly like /api/me does.
async function requireLogin(req, res, next) {
  res.set("Cache-Control", "no-store");

  const userId = getSessionUserId(req);
  if (userId) {
    req.cartUserId = userId;
    return next();
  }

  if (req.session && req.session.userId) {
    try {
      await destroySession(req);
    } catch (err) {
      console.error("[cart] Could not remove expired session:", err.code || "", err.message);
    }
    clearSessionCookie(res);
  }
  return res.status(401).json({ success: false, message: MSG_NOT_LOGGED_IN });
}

router.use(requireLogin);

// ---------- Cart helpers ----------

// Returns { id, user_id } of the customer's cart, creating it the first
// time. Returns null when the account no longer exists or is inactive.
// `client` is either db (single query) or a transaction client.
async function getOrCreateCart(client, userId) {
  // Creates the cart only for an existing, active user. ON CONFLICT: if
  // the cart already exists (or two requests race), nothing happens.
  await client.query(
    `INSERT INTO carts (user_id)
     SELECT id FROM users WHERE id = $1 AND is_active = TRUE
     ON CONFLICT (user_id) DO NOTHING`,
    [userId]
  );

  const result = await client.query(
    `SELECT c.id, c.user_id
       FROM carts c
       JOIN users u ON u.id = c.user_id
      WHERE c.user_id = $1 AND u.is_active = TRUE`,
    [userId]
  );
  return result.rows[0] || null;
}

// The account was deleted or deactivated after login: end the session
// (same as GET /api/me) and answer 401.
async function endSessionAndDeny(req, res) {
  try {
    await destroySession(req);
  } catch (err) {
    console.error("[cart] Could not remove session:", err.code || "", err.message);
  }
  clearSessionCookie(res);
  return res.status(401).json({ success: false, message: MSG_NOT_LOGGED_IN });
}

// One place decides which columns leave the API.
function formatItem(row) {
  const unitPrice = toPrice(row.unit_price);
  const options = orderOptions(row.options);
  const lineTotalPence = toPence(unitPrice) * row.quantity;

  return {
    id: row.id,
    product_id: row.product_id,
    product_variant_id: row.product_variant_id,
    frontend_product_id: row.frontend_product_id,
    line_key: row.line_key,
    options,
    unit_price: unitPrice,
    quantity: row.quantity,
    line_total: lineTotalPence / 100,
    fabric_image: row.fabric_image,
    name: row.name,
    url: row.url,
    image: row.image,
    alt: row.alt,
    category: row.category,
    created_at: row.created_at,
    updated_at: row.updated_at,
    // Current state of the product/size in the database, so the page can
    // warn when something is no longer available.
    product: {
      id: row.product_id,
      slug: row.product_slug,
      name: row.product_name,
      main_image: row.product_main_image,
      is_active: row.product_is_active,
    },
    variant: row.product_variant_id
      ? {
          id: row.product_variant_id,
          option_type: row.variant_option_type,
          option_value: row.variant_option_value,
          option_label: row.variant_option_label,
          price: toPrice(row.variant_price),
          is_active: row.variant_is_active,
        }
      : null,
    // The same line in the shape of a frontend localStorage cart line
    // (rabboraCart), with the same keys, for when the pages switch over.
    frontend_item: {
      lineId: row.line_key,
      id: row.frontend_product_id,
      // The page's own slug is the part after "#/" in its url
      // (e.g. "best-sellers.html#/art-deco-bed-style").
      slug: (typeof row.url === "string" && row.url.includes("#/")
        ? row.url.slice(row.url.indexOf("#/") + 2)
        : row.product_slug) || null,
      name: row.name,
      url: row.url || "index.html",
      image: row.image || "",
      alt: row.alt || row.name,
      price: unitPrice,
      variant: Object.keys(options).length ? options : null,
      fabricImage: row.fabric_image || "",
      category: row.category || "",
      quantity: row.quantity,
      addedAt: new Date(row.created_at).getTime(),
    },
  };
}

// The whole cart, lines in the order they were added (like the frontend).
async function loadCart(client, cart) {
  const result = await client.query(
    `SELECT ci.id, ci.product_id, ci.product_variant_id, ci.frontend_product_id,
            ci.line_key, ci.options, ci.unit_price, ci.fabric_image, ci.name,
            ci.url, ci.image, ci.alt, ci.category, ci.quantity,
            ci.created_at, ci.updated_at,
            p.slug        AS product_slug,
            p.name        AS product_name,
            p.main_image  AS product_main_image,
            p.is_active   AS product_is_active,
            v.option_type  AS variant_option_type,
            v.option_value AS variant_option_value,
            v.option_label AS variant_option_label,
            v.price        AS variant_price,
            v.is_active    AS variant_is_active
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       LEFT JOIN product_variants v ON v.id = ci.product_variant_id
      WHERE ci.cart_id = $1
      ORDER BY ci.created_at, ci.id`,
    [cart.id]
  );

  const items = result.rows.map(formatItem);
  let itemCount = 0;
  let subtotalPence = 0;
  for (const item of items) {
    itemCount += item.quantity;
    subtotalPence += toPence(item.unit_price) * item.quantity;
  }

  return {
    id: cart.id,
    user_id: cart.user_id,
    items,
    item_count: itemCount,
    subtotal: subtotalPence / 100,
  };
}

// ---------- Validation of POST /api/cart/items ----------

// Checks the "options" object: known keys only, simple values only.
// Returns an error message, or null when it is fine.
function checkOptions(options) {
  const keys = Object.keys(options);
  if (keys.length > OPTION_KEYS.size) return "options has too many keys.";

  for (const key of keys) {
    if (!OPTION_KEYS.has(key)) return `options.${key} is not a known cart option.`;

    const value = options[key];
    if (value === null) continue;

    if (typeof value === "string") {
      const max = key === "customRequest" ? MAX_CUSTOM_REQUEST : MAX_OPTION_TEXT;
      if (value.length > max) return `options.${key} is too long (maximum ${max} characters).`;
      continue;
    }
    if (typeof value === "number" && Number.isFinite(value)) continue;
    if (typeof value === "boolean") continue;

    return `options.${key} must be text, a number or null.`;
  }
  return null;
}

// Reads and checks the request body. Returns { error } or { line }.
// Only the fields listed here are ever read (user_id, cart_id, id ... in
// the body are ignored).
function readLine(body) {
  if (!isPlainObject(body)) return { error: "Request body must be a JSON object." };

  const productId = body.product_id;
  if (!isPositiveId(productId)) return { error: "product_id must be a positive whole number." };

  let variantId = body.product_variant_id;
  if (variantId === undefined || variantId === null) {
    variantId = null;
  } else if (!isPositiveId(variantId)) {
    return { error: "product_variant_id must be a positive whole number or null." };
  }

  const frontendId = body.frontend_product_id;
  if (typeof frontendId !== "string" || frontendId.trim() === "") {
    return { error: "frontend_product_id is required." };
  }
  if (frontendId.length > MAX_FRONTEND_ID) return { error: "frontend_product_id is too long." };

  const lineKey = body.line_key;
  if (typeof lineKey !== "string" || lineKey.trim() === "") {
    return { error: "line_key is required." };
  }
  if (Buffer.byteLength(lineKey, "utf8") > MAX_LINE_KEY_BYTES) return { error: "line_key is too long." };

  const options = body.options === undefined || body.options === null ? {} : body.options;
  if (!isPlainObject(options)) return { error: "options must be a JSON object." };
  const optionsError = checkOptions(options);
  if (optionsError) return { error: optionsError };

  // The line_key must be exactly what the frontend's buildLineId() gives
  // for this frontend_product_id + options. It is not changed — only
  // checked — so different options can never share one line_key.
  if (lineKey !== buildLineId(frontendId, options)) {
    return { error: "line_key does not match frontend_product_id and options." };
  }

  const unitPrice = body.unit_price;
  if (typeof unitPrice !== "number" || !Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > MAX_PRICE) {
    return { error: "unit_price must be a number of 0 or more." };
  }
  if (Math.abs(unitPrice * 100 - Math.round(unitPrice * 100)) > 1e-6) {
    return { error: "unit_price can have at most 2 decimal places." };
  }

  let quantity = body.quantity;
  if (quantity === undefined) quantity = 1; // same default as the frontend
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return { error: `quantity must be a whole number from 1 to ${MAX_QUANTITY}.` };
  }

  const name = body.name;
  if (typeof name !== "string" || name.trim() === "" || name.length > MAX_NAME) {
    return { error: "name is required (maximum 255 characters)." };
  }

  const texts = {};
  for (const field of ["url", "image", "alt", "category", "fabric_image"]) {
    const checked = optionalText(body[field], MAX_TEXT);
    if (!checked.ok) return { error: `${field} must be text (maximum ${MAX_TEXT} characters).` };
    texts[field] = checked.value;
  }
  for (const field of ["url", "image", "fabric_image"]) {
    if (texts[field] !== null && !isSafeRelativePath(texts[field])) {
      return { error: `${field} must be a path on this website.` };
    }
  }

  return {
    line: {
      productId,
      variantId,
      frontendId,
      lineKey,
      options,
      unitPrice,
      quantity,
      name,
      ...texts,
    },
  };
}

// Checks the submitted unit price against PostgreSQL, using only the
// frontend's existing price rules (see top of file):
// - With a size: price = the size's database price + £59 if assembly is
//   "yes" + £15 if detailing buttons are chosen on the Slatted Ottoman
//   page. It must match exactly (to the penny).
// - Without a size (a line added from the wishlist, which has no
//   options): the price must be the product's database price or one of
//   its active size prices, optionally + £59 assembly (+ £15 buttons on
//   the Slatted Ottoman page), because the wishlist only saves the price
//   that was shown.
// Returns true when the price is right.
function checkUnitPrice(line, product, variant, activeVariantPrices) {
  const submitted = toPence(line.unitPrice);
  const assemblyYes = line.options.assembly === "yes";
  const buttonsYes = line.frontendId.startsWith(OTTOMAN_PAGE_ID_PREFIX) && line.options.buttons === "Yes";

  // assemblyPrice, when the page sends it, must agree with assembly.
  if (line.options.assemblyPrice !== undefined && line.options.assemblyPrice !== null) {
    if (toPence(line.options.assemblyPrice) !== (assemblyYes ? ASSEMBLY_PRICE_PENCE : 0)) return false;
  }

  if (variant) {
    const expected =
      toPence(variant.price) +
      (assemblyYes ? ASSEMBLY_PRICE_PENCE : 0) +
      (buttonsYes ? OTTOMAN_BUTTONS_PRICE_PENCE : 0);
    return submitted === expected;
  }

  const bases = [toPence(product.price), ...activeVariantPrices.map(toPence)];
  const extras = line.frontendId.startsWith(OTTOMAN_PAGE_ID_PREFIX)
    ? [0, ASSEMBLY_PRICE_PENCE, OTTOMAN_BUTTONS_PRICE_PENCE, ASSEMBLY_PRICE_PENCE + OTTOMAN_BUTTONS_PRICE_PENCE]
    : [0, ASSEMBLY_PRICE_PENCE];
  return bases.some((base) => extras.some((extra) => base + extra === submitted));
}

// ---------- GET /api/cart ----------

router.get("/", async (req, res) => {
  try {
    const cart = await getOrCreateCart(db, req.cartUserId);
    if (!cart) return endSessionAndDeny(req, res);

    return res.status(200).json({ success: true, cart: await loadCart(db, cart) });
  } catch (err) {
    console.error("[cart] Could not load cart:", err.code || "", err.message);
    return res.status(500).json({ success: false, message: MSG_LOAD_ERROR });
  }
});

// ---------- POST /api/cart/items ----------

router.post("/items", async (req, res) => {
  const { error, line } = readLine(req.body);
  if (error) return res.status(400).json({ success: false, message: error });

  const client = await db.pool.connect().catch((err) => {
    console.error("[cart] Could not connect to the database:", err.code || "", err.message);
    return null;
  });
  if (!client) return res.status(500).json({ success: false, message: MSG_SAVE_ERROR });

  try {
    await client.query("BEGIN");

    const cart = await getOrCreateCart(client, req.cartUserId);
    if (!cart) {
      await client.query("ROLLBACK");
      return endSessionAndDeny(req, res);
    }

    // 1. The product must exist and be active.
    const productResult = await client.query(
      `SELECT id, price FROM products WHERE id = $1 AND is_active = TRUE`,
      [line.productId]
    );
    const product = productResult.rows[0];
    if (!product) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, message: MSG_PRODUCT_UNAVAILABLE });
    }

    // 2. Its active sizes/widths.
    const variantsResult = await client.query(
      `SELECT id, option_type, option_value, price
         FROM product_variants
        WHERE product_id = $1 AND is_active = TRUE`,
      [line.productId]
    );
    const activeVariants = variantsResult.rows;

    let variant = null;
    if (line.variantId !== null) {
      // The size must exist, be active and belong to THIS product.
      variant = activeVariants.find((v) => v.id === line.variantId) || null;
      if (!variant) {
        await client.query("ROLLBACK");
        return res.status(400).json({ success: false, message: MSG_VARIANT_UNAVAILABLE });
      }
      // The size named in options must be this size ("size" for beds,
      // mattresses and sofas, "width" for blanket boxes).
      const chosen = line.options[variant.option_type];
      if (chosen !== undefined && chosen !== null && chosen !== "" && String(chosen) !== variant.option_value) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: `options.${variant.option_type} does not match product_variant_id.`,
        });
      }
    } else {
      // No size given: allowed only when the line names no size either
      // (e.g. added from the wishlist). A line with a size must send its
      // product_variant_id, so its price can be checked exactly.
      const namesASize = ["size", "width"].some(
        (key) => line.options[key] !== undefined && line.options[key] !== null && line.options[key] !== ""
      );
      if (namesASize) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          success: false,
          message: "product_variant_id is required when options include a size or width.",
        });
      }
    }

    // 3. The price must match the database (see checkUnitPrice).
    if (!checkUnitPrice(line, product, variant, activeVariants.map((v) => v.price))) {
      await client.query("ROLLBACK");
      return res.status(409).json({ success: false, message: MSG_PRICE_CHANGED });
    }

    // 4. Add the line, or raise the quantity of the same line.
    //    On an existing line only quantity and updated_at change: the
    //    first unit_price, name, image ... are kept (frontend behaviour).
    //    The WHERE makes sure the existing line really is the same product
    //    and size, and that the new quantity stays within the limit.
    const upsert = await client.query(
      `INSERT INTO cart_items
              (cart_id, product_id, product_variant_id, frontend_product_id, line_key,
               options, unit_price, fabric_image, name, url, image, alt, category, quantity)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11, $12, $13, $14)
       ON CONFLICT (cart_id, line_key) DO UPDATE
          SET quantity   = cart_items.quantity + EXCLUDED.quantity,
              updated_at = CURRENT_TIMESTAMP
        WHERE cart_items.product_id = EXCLUDED.product_id
          AND cart_items.product_variant_id IS NOT DISTINCT FROM EXCLUDED.product_variant_id
          AND cart_items.quantity + EXCLUDED.quantity <= $15
       RETURNING id, (xmax = 0) AS inserted`,
      [
        cart.id,
        line.productId,
        line.variantId,
        line.frontendId,
        line.lineKey,
        JSON.stringify(line.options),
        line.unitPrice,
        line.fabric_image,
        line.name,
        line.url,
        line.image,
        line.alt,
        line.category,
        line.quantity,
        MAX_QUANTITY,
      ]
    );

    if (upsert.rowCount === 0) {
      // The line exists but the WHERE above refused the update.
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: `This line cannot be updated (a line can hold at most ${MAX_QUANTITY} items).`,
      });
    }

    await client.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);
    await client.query("COMMIT");

    const inserted = upsert.rows[0].inserted === true;
    const fullCart = await loadCart(db, cart);
    return res.status(inserted ? 201 : 200).json({
      success: true,
      message: inserted ? "Item added to your cart." : "Quantity updated in your cart.",
      item: fullCart.items.find((item) => item.id === upsert.rows[0].id) || null,
      cart: fullCart,
    });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackErr) {
      console.error("[cart] Rollback failed:", rollbackErr.code || "", rollbackErr.message);
    }
    console.error("[cart] Could not add item:", err.code || "", err.message);
    return res.status(500).json({ success: false, message: MSG_SAVE_ERROR });
  } finally {
    client.release();
  }
});

// ---------- PATCH /api/cart/items/:id ----------

router.patch("/items/:id", async (req, res) => {
  const itemId = parseIdParam(req.params.id);
  if (!itemId) return res.status(404).json({ success: false, message: MSG_ITEM_NOT_FOUND });

  const body = req.body;
  if (!isPlainObject(body)) {
    return res.status(400).json({ success: false, message: "Request body must be a JSON object." });
  }
  // Only the quantity can change. Product, size, line_key, options and
  // price are fixed once a line exists.
  const otherFields = Object.keys(body).filter((key) => key !== "quantity");
  if (otherFields.length > 0) {
    return res.status(400).json({ success: false, message: "Only quantity can be changed." });
  }

  const quantity = body.quantity;
  if (quantity === 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be at least 1. To remove an item use DELETE /api/cart/items/:id.",
    });
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return res.status(400).json({
      success: false,
      message: `quantity must be a whole number from 1 to ${MAX_QUANTITY}.`,
    });
  }

  try {
    const cart = await getOrCreateCart(db, req.cartUserId);
    if (!cart) return endSessionAndDeny(req, res);

    // cart_id = the logged-in customer's cart, so nobody can change
    // another customer's line.
    const result = await db.query(
      `UPDATE cart_items
          SET quantity = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2 AND cart_id = $3
       RETURNING id`,
      [quantity, itemId, cart.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: MSG_ITEM_NOT_FOUND });
    }

    await db.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);

    const fullCart = await loadCart(db, cart);
    return res.status(200).json({
      success: true,
      message: "Quantity updated.",
      item: fullCart.items.find((item) => item.id === itemId) || null,
      cart: fullCart,
    });
  } catch (err) {
    console.error("[cart] Could not update item:", err.code || "", err.message);
    return res.status(500).json({ success: false, message: MSG_SAVE_ERROR });
  }
});

// ---------- DELETE /api/cart/items/:id ----------

router.delete("/items/:id", async (req, res) => {
  const itemId = parseIdParam(req.params.id);
  if (!itemId) return res.status(404).json({ success: false, message: MSG_ITEM_NOT_FOUND });

  try {
    const cart = await getOrCreateCart(db, req.cartUserId);
    if (!cart) return endSessionAndDeny(req, res);

    const result = await db.query(
      `DELETE FROM cart_items WHERE id = $1 AND cart_id = $2 RETURNING id`,
      [itemId, cart.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: MSG_ITEM_NOT_FOUND });
    }

    await db.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);

    return res.status(200).json({
      success: true,
      message: "Item removed from your cart.",
      cart: await loadCart(db, cart),
    });
  } catch (err) {
    console.error("[cart] Could not remove item:", err.code || "", err.message);
    return res.status(500).json({ success: false, message: MSG_SAVE_ERROR });
  }
});

// ---------- DELETE /api/cart ----------

// Removes every line. The cart row and the user account are kept.
router.delete("/", async (req, res) => {
  try {
    const cart = await getOrCreateCart(db, req.cartUserId);
    if (!cart) return endSessionAndDeny(req, res);

    await db.query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.id]);
    await db.query(`UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [cart.id]);

    return res.status(200).json({
      success: true,
      message: "Your cart is now empty.",
      cart: await loadCart(db, cart),
    });
  } catch (err) {
    console.error("[cart] Could not clear cart:", err.code || "", err.message);
    return res.status(500).json({ success: false, message: MSG_SAVE_ERROR });
  }
});

module.exports = router;

// Shared with services/orderService.js, so an order checks every price
// with exactly the same rules as Add to Basket (no second copy).
module.exports.checkUnitPrice = checkUnitPrice;