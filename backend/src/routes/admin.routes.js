const express = require("express");
const router = express.Router();
const asyncHandler = require("../middlewares/asyncHandler");
const ctrl = require("../modules/admin/admin.controller");
const { role } = require("../middlewares/auth");

router.use(role("admin"));

router.get("/vendors", asyncHandler(ctrl.getVendors));
router.get("/vendors/blocked", asyncHandler(ctrl.getBlockedVendors));
router.patch("/vendors/:id/block", asyncHandler(ctrl.blockVendor));
router.patch("/vendors/:id/unblock", asyncHandler(ctrl.unblockVendor));
router.delete("/vendors/:id", asyncHandler(ctrl.deleteVendor));

router.get("/products", asyncHandler(ctrl.getAllProducts));
router.get("/users", asyncHandler(ctrl.getAllUsers));
router.get("/buyers", asyncHandler(ctrl.getAllBuyers));
router.get("/orders", asyncHandler(ctrl.getAllOrders));

module.exports = router;
