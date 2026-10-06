// Rabbora Living — option catalogues
//   GET   /api/fabrics                 active fabrics
//   POST  /api/fabrics                 admin: add a fabric
//   PATCH /api/fabrics/:id             admin: change a fabric
//   GET   /api/storage-options         active storage options
//   POST  /api/storage-options         admin: add a storage option
//   PATCH /api/storage-options/:id     admin: change a storage option

const express = require("express");
const c = require("../controllers/optionController");
const { requireAdmin } = require("../middleware/auth");

const fabricsRouter = express.Router();
fabricsRouter.get("/", c.listFabrics);
fabricsRouter.post("/", requireAdmin, c.createFabric);
fabricsRouter.patch("/:id", requireAdmin, c.updateFabric);

const storageRouter = express.Router();
storageRouter.get("/", c.listStorageOptions);
storageRouter.post("/", requireAdmin, c.createStorageOption);
storageRouter.patch("/:id", requireAdmin, c.updateStorageOption);

module.exports = { fabricsRouter, storageRouter };