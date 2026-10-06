// Rabbora Living — the pricing rules, in ONE place.
// These are the same rules the product pages already use:
//   discount %  = round((original - sale) / original * 100)
//   savings     = original - sale
//   monthly     = ceil(sale / 12)  -> "or from £X/month"
// Discount and savings only exist when a real original price is higher
// than the sale price. All maths is done in whole pence (integers), so
// there are no floating-point rounding errors with GBP.

const CURRENCY = "GBP";
const MAX_PENCE = 9999999999; // NUMERIC(10,2) -> 99,999,999.99

// "329.00" | 329 | null -> 32900 | null
function toPence(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
}

// 32900 -> 329 (number, as the frontend expects)
function fromPence(pence) {
  return pence === null || pence === undefined ? null : pence / 100;
}

// 32900 -> "329.00" (exact text for NUMERIC columns)
function penceToNumeric(pence) {
  const sign = pence < 0 ? "-" : "";
  const abs = Math.abs(pence);
  return sign + Math.floor(abs / 100) + "." + String(abs % 100).padStart(2, "0");
}

function monthlyFromPence(salePence) {
  return salePence && salePence > 0 ? Math.ceil(salePence / 1200) : null;
}

// Full pricing object for one size (or for a product's base price).
function buildPricing(salePrice, originalPrice) {
  const sale = toPence(salePrice);
  const original = toPence(originalPrice);
  const onSale = sale !== null && original !== null && original > sale;
  const savings = onSale ? original - sale : null;
  const pct = onSale ? Math.round((savings / original) * 100) : null;
  const monthly = monthlyFromPence(sale);

  return {
    salePrice: fromPence(sale),
    originalPrice: onSale ? fromPence(original) : null,
    discountPercentage: onSale && pct > 0 ? pct : null,
    savings: onSale ? fromPence(savings) : null,
    monthly,
    monthlyText: monthly ? `or from £${monthly}/month` : null,
    onSale,
    currency: CURRENCY,
  };
}

module.exports = { CURRENCY, MAX_PENCE, toPence, fromPence, penceToNumeric, monthlyFromPence, buildPricing };