// Rabbora Living — the basket line key, built the same way as
// RabboraCart.buildLineId() in cart-data.js and buildLineId() in routes/cart.js.
// Used to find the basket lines of a placed order when payment is confirmed.

function build(productId, variant) {
  const base = String(productId);
  if (!variant || typeof variant !== "object") return base;
  const keys = Object.keys(variant).filter((key) => {
    const value = variant[key];
    return value !== null && value !== undefined && value !== "";
  });
  if (keys.length === 0) return base;
  keys.sort();
  return base + "::" + keys.map((key) => key + ":" + String(variant[key])).join("|");
}

module.exports = { build };