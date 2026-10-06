// Rabbora Living — inventory requests (admin only).

const inventoryService = require("../services/inventoryService");
const { check, parseId, pagination } = require("../utils/validate");
const { notFound } = require("../utils/AppError");

module.exports = {
  // GET /api/inventory?lowStock=true&productId=12
  list: async (req, res) => {
    const { limit, offset, page } = pagination(req.query, 50, 200);
    const items = await inventoryService.listInventory({
      lowStock: req.query.lowStock === "true",
      productId: parseId(String(req.query.productId || "")),
      limit,
      offset,
    });
    res.status(200).json({ success: true, page, limit, count: items.length, items });
  },
  get: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Inventory item not found.");
    res.status(200).json({ success: true, item: await inventoryService.getInventory(id) });
  },
  // POST /api/inventory { productId, productVariantId?, sku, stockQuantity, lowStockThreshold, isActive }
  create: async (req, res) => {
    const d = check(req.body)
      .id("productId", { required: true }).id("productVariantId")
      .text("sku", { required: true, max: 64 })
      .int("stockQuantity", { min: 0, max: 1000000 }).int("lowStockThreshold", { min: 0, max: 1000000 })
      .bool("isActive").done();
    res.status(201).json({ success: true, item: await inventoryService.createInventory(d) });
  },
  // PATCH /api/inventory/:id { stockQuantity | adjustBy, lowStockThreshold, sku, isActive }
  update: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Inventory item not found.");
    const d = check(req.body)
      .int("stockQuantity", { min: 0, max: 1000000 }).int("adjustBy", { min: -1000000, max: 1000000 })
      .int("lowStockThreshold", { min: 0, max: 1000000 }).text("sku", { max: 64 }).bool("isActive").done();
    res.status(200).json({ success: true, item: await inventoryService.updateInventory(id, d) });
  },
};