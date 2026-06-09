const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const ctrl = require("../modules/orders/payment.controller");
const { protect } = require("../middlewares/auth");

router.post("/create-checkout-session", protect, asyncHandler(ctrl.createCheckoutSession));

module.exports = router;
