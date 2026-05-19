const express = require("express");

const router = express.Router();

const asyncHandler = require("../middlewares/asyncHandler");

const ctrl = require("../modules/products/product.controller");

const { role, protect } = require("../middlewares/auth");

const validate = require("../middlewares/validate");

const { createProductSchema } = require("../validations/product.validation");

const upload = require("../middlewares/s3UploadHandler");

/**
 * CREATE PRODUCT
 */

router.post(
  "/",
  protect,
  role("vendor"),
  upload.single("images"),
  validate(createProductSchema),
  asyncHandler(ctrl.createProduct)
);

/**
 * UPDATE PRODUCT
 */

router.put(
  "/:id",
  protect,
  role("vendor"),
  upload.single("images"),
  asyncHandler(ctrl.updateProduct)
);

/**
 * GET ALL PRODUCTS
 */

router.get("/", asyncHandler(ctrl.getProducts));

/**
 * GET PRODUCTS BY VENDOR
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
