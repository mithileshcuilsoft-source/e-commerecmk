const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// GET CART
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      userId: req.user.id,
    }).populate(
      "items.productId",
      "name price images stock isActive variants"
    );

    // CREATE EMPTY CART
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    // REMOVE INVALID PRODUCTS
    cart.items = cart.items.filter((item) => {
      return (
        item.productId &&
        item.productId.isActive &&
        item.productId.stock >= item.quantity
      );
    });

    await cart.save();

    return res.status(200).json({
      success: true,
      items: cart.items,
      cart,
    });
  } catch (error) {
    console.log("GET CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD TO CART
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant } = req.body;

    // VALIDATION
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // FIND PRODUCT
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // PRODUCT ACTIVE CHECK
    if (product.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Product unavailable",
      });
    }

    // STOCK CHECK
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    // FIND CART
    let cart = await Cart.findOne({
      userId: req.user.id,
    });

    // CREATE CART
    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [],
      });
    }

    // CHECK EXISTING ITEM
    const existingItem = cart.items.find((item) => {
      return (
        item.productId.toString() === String(productId) &&
        item.variant === variant
      );
    });

    // UPDATE EXISTING ITEM
    if (existingItem) {
      const newQty =
        existingItem.quantity + Number(quantity);

      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Stock limit exceeded",
        });
      }

      existingItem.quantity = newQty;
    } else {
      // ADD NEW ITEM
      cart.items.push({
        productId,
        quantity: Number(quantity),
        variant,
      });
    }

    // SAVE CART
    await cart.save();

    // POPULATE PRODUCTS
    await cart.populate(
      "items.productId",
      "name price images stock isActive variants"
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.log("ADD TO CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE CART ITEM
exports.updateCartItem = async (
  req,
  res,
  next
) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // FIND CART
    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // FIND ITEM
    const item = cart.items.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // FIND PRODUCT
    const product = await Product.findById(
      item.productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // STOCK CHECK
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available`,
      });
    }

    // UPDATE QUANTITY
    item.quantity = Number(quantity);

    await cart.save();

    await cart.populate(
      "items.productId",
      "name price images stock isActive variants"
    );

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      items: cart.items,
      cart,
    });
  } catch (error) {
    console.log("UPDATE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REMOVE ITEM
exports.removeFromCart = async (
  req,
  res,
  next
) => {
  try {
    const { itemId } = req.params;

    // FIND CART
    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // REMOVE ITEM
    cart.items.pull(itemId);

    await cart.save();

    await cart.populate(
      "items.productId",
      "name price images stock isActive variants"
    );

    return res.status(200).json({
      success: true,
      message: "Item removed",
      cart,
    });
  } catch (error) {
    console.log("REMOVE CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CLEAR CART
exports.clearCart = async (
  req,
  res,
  next
) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // CLEAR ITEMS
    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.log("CLEAR CART ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};