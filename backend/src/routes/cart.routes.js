// routes/cart.routes.js
const router = require("express").Router();
const asyncHandler = require("../middlewares/asyncHandler");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../modules/cart/cart.controller");
const { protect } = require("../middlewares/auth");

router.use(protect); // All cart routes require authentication

router.get("/", asyncHandler(getCart));
router.post("/add", asyncHandler(addToCart));
router.put("/item/:itemId", asyncHandler(updateCartItem));
router.delete("/item/:itemId", asyncHandler(removeFromCart));
router.delete("/", asyncHandler(clearCart));

module.exports = router;
