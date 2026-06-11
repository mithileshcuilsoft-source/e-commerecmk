const express = require("express");

const router = express.Router();

const controller = require("../modules/subscription/subscription.controller");

const { protect } = require("../middlewares/auth");
const { isPremium } = require("../middlewares/premium");

router.get("/plans",controller.getPlans);

router.post("/checkout",protect,controller.createCheckout);

router.get("/me",protect,controller.mySubscription);

router.get("/premium-content", protect, isPremium, (req, res) => {
  res.json({
    success: true,
    data: {
      message: "Welcome to the Premium Lounge!",
      exclusiveDeals: [
        { id: 1, name: "Premium Fragrance", discount: "50% OFF" },
        { id: 2, name: "Luxury Watch", discount: "30% OFF" },
      ],
    },
  });
});

module.exports = router;