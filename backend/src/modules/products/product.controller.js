const { deleteProductImage } = require("../../middlewares/s3UploadHandler");
const Product = require("../../models/Product");


const parseJsonField = (value) => {
  if (typeof value !== "string") return value;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const enhanceProductAvailability = (product) => {
  const productObject = product.toObject
    ? product.toObject()
    : product;

  const vendorBlocked =
    productObject.vendorId?.isBlocked || false;

  const available =
    productObject.isActive &&
    !vendorBlocked &&
    productObject.stock > 0;

  let unavailableReason = "";

  if (vendorBlocked) {
    unavailableReason = "Vendor is blocked by admin";
  } else if (!productObject.isActive) {
    unavailableReason = "Product is inactive";
  } else if (productObject.stock <= 0) {
    unavailableReason = "Out of stock";
  }

  return {
    ...productObject,
    available,
    vendorBlocked,
    unavailableReason,
  };
};

const cleanObject = (obj) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }

    return acc;
  }, {});


  const buildProductData = (req) => {
    const data = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
  
      price:
        req.body.price !== undefined
          ? Number(req.body.price)
          : undefined,
  
      stock:
        req.body.stock !== undefined
          ? Number(req.body.stock)
          : undefined,
  
      variants: parseJsonField(req.body.variants),
    };
  
    /**
     * S3 IMAGE URL
     */
    if (req.file) {
      console.log("FILE:", req.file);
  
      data.images = [req.file.location];
      data.images = [req.file.key];
    }
  
    return cleanObject(data);
  };
  
/**
 * CREATE PRODUCT
 */
exports.createProduct = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const productData = buildProductData(req);

    const newProduct = new Product({
      ...productData,
      vendorId: req.user.id,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.log("CREATE PRODUCT ERROR:", error);

    next(error);
  }
};

/**
 * GET PRODUCTS
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;

    let query = {
      isActive: true,
    };

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const products = await Product.find(query).populate(
      "vendorId",
      "name isBlocked"
    );

    res.json(products.map(enhanceProductAvailability));
  } catch (error) {
    next(error);
  }
};

/**
 * GET PRODUCT BY ID
 */
exports.getProductById = async (req, res, next) => {
  try {
    const foundProduct = await Product.findById(
      req.params.id
    ).populate("vendorId", "name isBlocked");

    if (!foundProduct) {
      const error = new Error("Product not found");

      error.statusCode = 404;

      return next(error);
    }

    res.json(enhanceProductAvailability(foundProduct));
  } catch (error) {
    next(error);
  }
};

/**
 * GET PRODUCTS BY VENDOR
 */
exports.getProductsByVendor = async (req, res, next) => {
  try {
    const products = await Product.find({
      vendorId: req.user.id,
    }).populate("vendorId", "name isBlocked");

    res.json(products.map(enhanceProductAvailability));
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE PRODUCT
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const productData = buildProductData(req);

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        vendorId: req.user.id,
      },
      productData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      const error = new Error(
        "Product not found or unauthorized"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE PRODUCT
 */
exports.deleteProductImage = async (imageKey) => {
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageKey,
      })
    );

    console.log(`Deleted image: ${imageKey}`);
  } catch (error) {
    console.error(
      `Failed to delete image ${imageKey}:`,
      error
    );
  }
};
/**
 * UPDATE STOCK
 */
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        vendorId: req.user.id,
      },
      {
        stock,
      },
      {
        new: true,
      }
    );

    if (!updatedProduct) {
      const error = new Error(
        "Product not found or unauthorized"
      );

      error.statusCode = 404;

      return next(error);
    }

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

/**
 * CHECK AVAILABILITY
 */
exports.checkAvailability = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const foundProduct = await Product.findById(
      req.params.id
    ).populate("vendorId", "name isBlocked");

    if (!foundProduct) {
      const error = new Error("Product not found");

      error.statusCode = 404;

      return next(error);
    }

    const vendorBlocked =
      foundProduct.vendorId?.isBlocked || false;

    const available =
      foundProduct.isActive &&
      !vendorBlocked &&
      foundProduct.stock >= quantity;

    res.json({
      productId: foundProduct._id,
      available,
      requestedQuantity: quantity,
      availableStock: foundProduct.stock,
      vendorBlocked,
    });
  } catch (error) {
    next(error);
  }
};