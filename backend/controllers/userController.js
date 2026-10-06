// Rabbora Living — profile, addresses and admin user management.

const userService = require("../services/userService");
const { check, parseId, pagination } = require("../utils/validate");
const { notFound } = require("../utils/AppError");

// Same name limits as registration (routes/auth.js).
function readAddress(body, required) {
  return check(body)
    .text("fullName", { required, max: 200 })
    .phone("phone", { required })
    .text("addressLine1", { required, max: 200 })
    .text("addressLine2", { max: 200 })
    .text("city", { required, max: 100 })
    .text("county", { max: 100 })
    .postcode("postcode", { required })
    .text("country", { max: 100 })
    .bool("isDefault")
    .done();
}

module.exports = {
  readAddress,

  // GET /api/users/me
  me: async (req, res) => {
    res.status(200).json({ success: true, user: await userService.getUser(req.user.id) });
  },

  // PATCH /api/users/me   { firstName, lastName, phone }
  updateMe: async (req, res) => {
    const d = check(req.body).text("firstName", { max: 100 }).text("lastName", { max: 100 }).phone("phone").done();
    res.status(200).json({ success: true, user: await userService.updateProfile(req.user.id, d) });
  },

  listAddresses: async (req, res) => {
    const addresses = await userService.listAddresses(req.user.id);
    res.status(200).json({ success: true, count: addresses.length, addresses });
  },
  createAddress: async (req, res) => {
    res.status(201).json({ success: true, address: await userService.createAddress(req.user.id, readAddress(req.body, true)) });
  },
  updateAddress: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Address not found.");
    res.status(200).json({ success: true, address: await userService.updateAddress(req.user.id, id, readAddress(req.body, false)) });
  },
  deleteAddress: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Address not found.");
    await userService.deleteAddress(req.user.id, id);
    res.status(200).json({ success: true, message: "Address deleted." });
  },

  // ----- admin -----
  list: async (req, res) => {
    const { limit, offset, page } = pagination(req.query);
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
    const result = await userService.listUsers({ limit, offset, search });
    res.status(200).json({ success: true, page, limit, ...result });
  },
  get: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("User not found.");
    res.status(200).json({ success: true, user: await userService.getUser(id) });
  },
  adminUpdate: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("User not found.");
    const d = check(req.body).oneOf("role", ["customer", "admin"]).bool("isActive").done();
    res.status(200).json({ success: true, user: await userService.adminUpdateUser(req.user.id, id, d) });
  },
};