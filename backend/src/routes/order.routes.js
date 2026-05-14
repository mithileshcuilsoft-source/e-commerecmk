const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const ctrl = require("../modules/orders/order.controller");
const { protect, role } = require("../middlewares/auth");


router.post("/calculate", protect, asyncHandler(ctrl.calculateCheckout));
router.post("/", protect, asyncHandler(ctrl.createOrder));
router.get("/", protect, asyncHandler(ctrl.getOrders));
router.get("/vendor", protect, role("vendor"), asyncHandler(ctrl.getVendorOrders));
router.get("/admin/all", protect, role("admin"), asyncHandler(ctrl.getAllOrders));
router.get("/:id", protect, asyncHandler(ctrl.getOrderById));
router.get("/:id/tracking", protect, asyncHandler(ctrl.getOrderTracking));
router.patch("/:id/status", protect, asyncHandler(ctrl.updateStatus));

module.exports = router;
