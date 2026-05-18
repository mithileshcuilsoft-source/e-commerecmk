const productRoutes = require("./product.routes");
const orderRoutes = require("./order.routes");
const authRoutes = require("./auth.routes");
const addressRoutes = require("./address.routes");
const cartRoutes = require("./cart.routes");
const userRoutes = require("./user.routes");
const { protect } = require("../middlewares/auth");
const adminRoutes = require("./admin.routes");
const router = require("express").Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);
router.use("/addresses", addressRoutes);
router.use("/cart", cartRoutes);
router.use("/admin", protect, adminRoutes);

module.exports = router;
