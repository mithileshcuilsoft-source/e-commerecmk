// routes/address.routes.js
const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const ctrl = require("../modules/address/address.controller");
const { protect } = require("../middlewares/auth");

router.use(protect); // All address routes require authentication

router.post("/migrate", asyncHandler(ctrl.migrateAddressTypes)); // One-time migration
router.post("/", asyncHandler(ctrl.addAddress));
router.get("/", asyncHandler(ctrl.getAddresses));
router.get("/:id", asyncHandler(ctrl.getAddress));
router.put("/:id", asyncHandler(ctrl.updateAddress));
router.delete("/:id", asyncHandler(ctrl.deleteAddress));
router.patch("/:id/default", asyncHandler(ctrl.setDefaultAddress));

module.exports = router;