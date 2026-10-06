// Rabbora Living — admin panel requests (dashboard + product lists).
// Changes to products use the existing admin endpoints in
// routes/products.js; this controller only answers the admin READS
// that the public product API does not give (inactive products,
// switched-off sizes, totals for the dashboard).

const adminService = require("../services/adminService");
const { parseId, pagination } = require("../utils/validate");
const { notFound } = require("../utils/AppError");

module.exports = {
  // GET /api/admin/stats
  stats: async (req, res) => {
    res.status(200).json({ success: true, stats: await adminService.getStats() });
  },

  // GET /api/admin/products?search=&categoryId=&status=active|inactive|all&featured=true&bestSeller=true&page=&limit=
  listProducts: async (req, res) => {
    const q = req.query;
    const { limit, offset, page } = pagination(q, 20, 100);
    const filters = {
      search: typeof q.search === "string" && q.search.trim() ? q.search.trim().slice(0, 100) : null,
      categoryId: parseId(String(q.categoryId || "")),
      status: ["active", "inactive"].includes(q.status) ? q.status : "all",
      featured: q.featured === "true",
      bestSeller: q.bestSeller === "true",
      limit,
      offset,
    };
    const result = await adminService.listProducts(filters);
    res.status(200).json({ success: true, page, limit, ...result });
  },

  // GET /api/admin/products/:id
  getProduct: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Product not found.");
    res.status(200).json({ success: true, ...(await adminService.getProduct(id)) });
  },

  // GET /api/admin/categories?search=
  listCategories: async (req, res) => {
    const categories = await adminService.listCategories({ search: searchText(req.query.search) });
    res.status(200).json({ success: true, count: categories.length, categories });
  },

  // GET /api/admin/fabrics?search=&status=active|inactive|all
  listFabrics: async (req, res) => {
    const status = ["active", "inactive"].includes(req.query.status) ? req.query.status : "all";
    const fabrics = await adminService.listFabrics({ search: searchText(req.query.search), status });
    res.status(200).json({ success: true, count: fabrics.length, fabrics });
  },

  // GET /api/admin/fabrics/:id/products
  fabricProducts: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Fabric not found.");
    const products = await adminService.optionProducts("fabric", id);
    res.status(200).json({ success: true, count: products.length, products });
  },

  // GET /api/admin/storage-options
  listStorageOptions: async (req, res) => {
    const storageOptions = await adminService.listStorageOptions();
    res.status(200).json({ success: true, count: storageOptions.length, storageOptions });
  },

  // GET /api/admin/storage-options/:id/products
  storageProducts: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Storage option not found.");
    const products = await adminService.optionProducts("storage", id);
    res.status(200).json({ success: true, count: products.length, products });
  },

  // GET /api/admin/inventory?search=&filter=all|low|out|tracked|untracked&page=&limit=
  listInventory: async (req, res) => {
    const { limit, offset, page } = pagination(req.query, 25, 100);
    const filter = ["low", "out", "tracked", "untracked"].includes(req.query.filter) ? req.query.filter : "all";
    const result = await adminService.listInventory({ search: searchText(req.query.search), filter, limit, offset });
    res.status(200).json({ success: true, page, limit, ...result });
  },
};

// GET /api/admin/orders?search=&status=&paymentStatus=&page=&limit=
module.exports.listOrders = async (req, res) => {
  const { limit, offset, page } = pagination(req.query, 25, 100);
  const result = await adminService.listOrders({
    search: searchText(req.query.search),
    status: typeof req.query.status === "string" ? req.query.status : null,
    paymentStatus: typeof req.query.paymentStatus === "string" ? req.query.paymentStatus : null,
    limit,
    offset,
  });
  res.status(200).json({ success: true, page, limit, ...result });
};

// GET /api/admin/customers?search=&role=customer|admin|all&status=active|inactive|all&page=&limit=
module.exports.listCustomers = async (req, res) => {
  const { limit, offset, page } = pagination(req.query, 25, 100);
  const role = ["customer", "admin", "all"].includes(req.query.role) ? req.query.role : "customer";
  const status = ["active", "inactive"].includes(req.query.status) ? req.query.status : "all";
  const result = await adminService.listCustomers({ search: searchText(req.query.search), role, status, limit, offset });
  res.status(200).json({ success: true, page, limit, ...result });
};

// GET /api/admin/customers/:id
module.exports.getCustomer = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Customer not found.");
  res.status(200).json({ success: true, customer: await adminService.getCustomer(id) });
};

// GET /api/admin/reviews?search=&status=pending|approved|all&page=&limit=
module.exports.listReviews = async (req, res) => {
  const { limit, offset, page } = pagination(req.query, 25, 100);
  const status = ["pending", "approved"].includes(req.query.status) ? req.query.status : "all";
  const result = await adminService.listReviews({ search: searchText(req.query.search), status, limit, offset });
  res.status(200).json({ success: true, page, limit, ...result });
};

// GET /api/admin/reviews/:id
module.exports.getReview = async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) throw notFound("Review not found.");
  res.status(200).json({ success: true, review: await adminService.getReview(id) });
};

function searchText(value) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, 100) : null;
}