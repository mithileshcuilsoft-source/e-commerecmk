const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();

const asyncHandler = require("../middlewares/asyncHandler");
const ctrl = require("../modules/products/product.controller");
const { role, protect } = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const { createProductSchema } = require("../validations/product.validation");

const uploadDir = path.join(__dirname, "../../uploads/products");
fs.mkdirSync(uploadDir, { recursive: true });

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),

  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

/**
 * ✅ CREATE PRODUCT (FIXED ORDER)
 */
router.post(
  "/",
  protect,
  role("vendor"),

  // 1. FIRST upload file (so req.body is populated)
  upload.single("thumbnail"),

  // 2. THEN validate body
  validate(createProductSchema),

  asyncHandler(ctrl.createProduct)
);

/**
 * GET PRODUCTS
 */
router.get("/", asyncHandler(ctrl.getProducts));

/**
 * GET VENDOR PRODUCTS
 */
router.get(
  "/vendor",
  protect,
  role("vendor"),
  asyncHandler(ctrl.getProductsByVendor)
);

/**
 * GET PRODUCT BY ID
 */
router.get("/:id", protect, asyncHandler(ctrl.getProductById));

/**
 * UPDATE PRODUCT
 */
router.put(
  "/:id",
  protect,
  role("vendor"),
  upload.single("thumbnail"),
  asyncHandler(ctrl.updateProduct)
);

/**
 * DELETE PRODUCT
 */
router.delete(
  "/:id",
  protect,
  role("vendor"),
  asyncHandler(ctrl.deleteProduct)
);

/**
 * UPDATE STOCK
 */
router.patch(
  "/:id/stock",
  protect,
  role("vendor"),
  asyncHandler(ctrl.updateStock)
);

/**
 * CHECK AVAILABILITY
 */
router.post(
  "/:id/check-availability",
  protect,
  asyncHandler(ctrl.checkAvailability)
);

module.exports = router;
