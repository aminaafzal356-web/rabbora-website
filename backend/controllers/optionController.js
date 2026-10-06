// Rabbora Living — fabric and storage option catalogue requests.

const optionService = require("../services/optionService");
const { check, parseId } = require("../utils/validate");
const { notFound, validationError } = require("../utils/AppError");

// Required fields can be left out of a PATCH, but not sent empty.
function rejectEmpty(data, fields) {
  const errors = fields.filter((f) => data[f] === null).map((field) => ({ field, message: `${field} cannot be empty.` }));
  if (errors.length) throw validationError(errors);
  return data;
}

const readFabric = (body, required) => check(body)
  .slug("slug", { required, max: 100 }).text("name", { required, max: 100 })
  .text("collection", { max: 100 }).text("imageUrl", { max: 1000 })
  .int("sortOrder", { min: 0, max: 100000 }).bool("isActive").done();

const readStorage = (body, required) => check(body)
  .slug("code", { required, max: 50 }).text("name", { required, max: 100 })
  .text("description", { max: 2000 }).int("sortOrder", { min: 0, max: 100000 }).bool("isActive").done();

module.exports = {
  listFabrics: async (req, res) => {
    const fabrics = await optionService.listFabrics();
    res.status(200).json({ success: true, count: fabrics.length, fabrics });
  },
  createFabric: async (req, res) => {
    res.status(201).json({ success: true, fabric: await optionService.createFabric(readFabric(req.body, true)) });
  },
  updateFabric: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Fabric not found.");
    res.status(200).json({ success: true, fabric: await optionService.updateFabric(id, rejectEmpty(readFabric(req.body, false), ["slug", "name"])) });
  },
  listStorageOptions: async (req, res) => {
    const storageOptions = await optionService.listStorageOptions();
    res.status(200).json({ success: true, count: storageOptions.length, storageOptions });
  },
  createStorageOption: async (req, res) => {
    res.status(201).json({ success: true, storageOption: await optionService.createStorageOption(readStorage(req.body, true)) });
  },
  updateStorageOption: async (req, res) => {
    const id = parseId(req.params.id);
    if (!id) throw notFound("Storage option not found.");
    res.status(200).json({ success: true, storageOption: await optionService.updateStorageOption(id, rejectEmpty(readStorage(req.body, false), ["code", "name"])) });
  },
};