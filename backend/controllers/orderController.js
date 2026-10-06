// Rabbora Living — order requests.

const orderService = require("../services/orderService");
const paymentService = require("../services/paymentService");
const { readAddress } = require("./userController");
const { check, parseId, pagination, isPlainObject } = require("../utils/validate");
const { notFound, validationError } = require("../utils/AppError");

module.exports = {
  // POST /api/orders
  // { shippingAddressId } or { shippingAddress: {...} },
  // optional { billingAddressId } or { billingAddress: {...} } (default: same as shipping),
  // optional { notes }
  create: async (req, res) => {
    const body = isPlainObject(req.body) ? req.body : {};
    const d = check(body).id("shippingAddressId").id("billingAddressId").text("notes", { max: 1000 }).done();
    if (!d.shippingAddressId) {
      if (!isPlainObject(body.shippingAddress)) {
        throw validationError([{ field: "shippingAddress", message: "shippingAddressId or shippingAddress is required." }]);
      }
      d.shippingAddress = readAddress(body.shippingAddress, true);
    }
    if (!d.billingAddressId && body.billingAddress !== undefined && body.billingAddress !== null) {
      if (!isPlainObject(body.billingAddress)) throw validationError([{ field: "billingAddress", message: "billingAddress must be an address object." }]);
      d.billingAddress = readAddress(body.billingAddress, true);
    }
    const order = await orderService.placeOrder(req.user, d);
    res.status(201).json({ success: true, order, message: "Thank you — your order has been placed." });
  },

  // GET /api/orders  (mine)   — admins: ?all=true&status=pending
  list: async (req, res) => {
    const { limit, offset, page } = pagination(req.query);
    const isAdminView = req.user.role === "admin" && req.query.all === "true";
    const status = orderService.STATUSES.includes(req.query.status) ? req.query.status : null;
    const result = await orderService.listOrders({ userId: isAdminView ? null : req.user.id, status, limit, offset });
    res.status(200).json({ success: true, page, limit, ...result });
  },

  // GET /api/orders/:id  (own order, or any order for admins)
  get: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Order not found.");
    res.status(200).json({ success: true, order: await orderService.getOrder(req.user, id) });
  },

  // POST /api/orders/:id/cancel  (own pending, unpaid order)
  cancel: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Order not found.");
    const order = await orderService.cancelOwnOrder(req.user, id);
    // Close the order's open Stripe payment page, if there is one.
    await paymentService.expireOpenSession(id);
    res.status(200).json({ success: true, order });
  },

  // PATCH /api/orders/:id  (admin)  { status }
  adminUpdate: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Order not found.");
    // Payment status is set only by Stripe (routes/payments.js): paid by the
    // checkout webhook, refunded by the refund webhook — never by hand.
    if (isPlainObject(req.body) && req.body.paymentStatus !== undefined) {
      throw validationError([{ field: "paymentStatus", message: "Payment status is updated by Stripe only." }]);
    }
    const d = check(req.body).oneOf("status", orderService.STATUSES).done();
    const order = await orderService.adminUpdateOrder(req.user, id, d);
    if (d.status === "cancelled" || d.status === "refunded") await paymentService.expireOpenSession(id);
    res.status(200).json({ success: true, order });
  },
};