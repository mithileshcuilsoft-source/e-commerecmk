const Product = require("../../models/Product");
const Cart = require("../../models/Cart");
const Order = require("../../models/Order");

/* =========================================================
   CREATE ORDER
========================================================= */
exports.createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes,
    } = req.body;

    // VALIDATION
    if (!items || items.length === 0) {
      const error = new Error("Order items are required");
      error.statusCode = 400;
      return next(error);
    }

    if (!shippingAddress) {
      const error = new Error("Shipping address is required");
      error.statusCode = 400;
      return next(error);
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate(
        "vendorId",
        "isBlocked"
      );

      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        return next(error);
      }

      if (product.vendorId?.isBlocked) {
        const error = new Error(
          `Product "${product.name}" is not available because vendor is blocked`
        );
        error.statusCode = 403;
        return next(error);
      }

      if (!product.isActive) {
        const error = new Error(
          `Product "${product.name}" is unavailable`
        );
        error.statusCode = 400;
        return next(error);
      }

      if (product.stock < item.quantity) {
        const error = new Error(
          `Only ${product.stock} stock available for "${product.name}"`
        );
        error.statusCode = 400;
        return next(error);
      }

      let itemPrice = product.price;

      subtotal += itemPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: itemPrice,
        variant: item.variant || null,
      });

      // reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    // TAX
    const tax = subtotal * 0.085;

    // SHIPPING
    const shippingCost = subtotal > 50 ? 0 : 5.99;

    // DISCOUNT
    let discount = 0;
    if (subtotal > 100) {
      discount = subtotal * 0.1;
    }

    // TOTAL
    const total = subtotal + tax + shippingCost - discount;

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      shippingAddress,
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
      paymentMethod,
      notes,
      status: "placed",
      paymentStatus: "pending",
      trackingHistory: [
        {
          status: "placed",
          timestamp: new Date(),
          note: "Order placed successfully",
          updatedBy: req.user.id,
        },
      ],
    });

    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    next(error);
  }
};

/* =========================================================
   UPDATE STATUS
========================================================= */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate(
      "items.productId",
      "vendorId"
    );

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    const isOrderOwner =
      order.userId.toString() === req.user.id;

    const isVendorOwner =
      req.user.role === "vendor" &&
      order.items.some(
        (item) =>
          item.productId?.vendorId?.toString() === req.user.id
      );

    if (
      req.user.role !== "admin" &&
      !isOrderOwner &&
      !isVendorOwner
    ) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    const validStatuses = [
      "placed",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      const error = new Error("Invalid status");
      error.statusCode = 400;
      return next(error);
    }

    const validTransitions = {
      placed: ["confirmed", "cancelled"],
      confirmed: ["processing", "cancelled"],
      processing: ["shipped", "cancelled"],
      shipped: ["delivered"],
      delivered: [],
      cancelled: ["refunded"],
      refunded: [],
    };

    const allowed = validTransitions[order.status] || [];

    if (!allowed.includes(status)) {
      const error = new Error(
        `Cannot change status from ${order.status} to ${status}`
      );
      error.statusCode = 400;
      return next(error);
    }

    // restore stock on cancel
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    order.status = status;

    if (status === "shipped" && req.body.trackingNumber) {
      order.trackingNumber = req.body.trackingNumber;
    }

    order.trackingHistory.push({
      status,
      timestamp: new Date(),
      note: req.body.note || `Order status changed to ${status}`,
      updatedBy: req.user.id,
    });

    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET USER ORDERS
========================================================= */
exports.getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId: req.user.id };

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("items.productId", "name price images")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET ORDER BY ID
========================================================= */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId", "name price images")
      .populate("shippingAddress");

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      req.user.role !== "admin" &&
      order.userId.toString() !== req.user.id
    ) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   VENDOR ORDERS
========================================================= */
exports.getVendorOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("userId", "name email phone")
      .populate("items.productId", "name price images vendorId")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    const vendorId = req.user.id;

    const vendorOrders = orders.filter((order) =>
      order.items.some(
        (item) =>
          item.productId?.vendorId?.toString() === vendorId
      )
    );

    res.json({ orders: vendorOrders });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   ADMIN ALL ORDERS
========================================================= */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .populate("shippingAddress")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   ORDER TRACKING
========================================================= */
exports.getOrderTracking = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("trackingHistory.updatedBy", "name role")
      .select("userId status trackingNumber trackingHistory createdAt");

    if (!order) {
      const error = new Error("Order not found");
      error.statusCode = 404;
      return next(error);
    }

    if (
      req.user.role !== "admin" &&
      req.user.role !== "vendor" &&
      order.userId.toString() !== req.user.id
    ) {
      const error = new Error("Access denied");
      error.statusCode = 403;
      return next(error);
    }

    const lifecycleSteps = [
      { status: "placed", label: "Order Placed", description: "Your order has been placed successfully" },
      { status: "confirmed", label: "Order Confirmed", description: "Your order has been confirmed by the seller" },
      { status: "processing", label: "Processing", description: "Your order is being prepared" },
      { status: "shipped", label: "Shipped", description: "Your order has been shipped" },
      { status: "delivered", label: "Delivered", description: "Your order has been delivered successfully" },
    ];

    const trackingTimeline = lifecycleSteps.map((step) => {
      const historyEntry = order.trackingHistory.find(
        (h) => h.status === step.status
      );

      return {
        ...step,
        completed: !!historyEntry,
        timestamp: historyEntry?.timestamp,
        note: historyEntry?.note,
        updatedBy: historyEntry?.updatedBy,
      };
    });

    res.json({
      orderId: order._id,
      currentStatus: order.status,
      trackingNumber: order.trackingNumber,
      orderDate: order.createdAt,
      trackingTimeline,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   CALCULATE CHECKOUT (FIXED)
========================================================= */
exports.calculateCheckout = async (req, res, next) => {
  try {
    const { items } = req.body;

    // ✅ FIXED: safe empty cart handling
    if (!items || items.length === 0) {
      return res.json({
        items: [],
        subtotal: 0,
        tax: 0,
        shippingCost: 0,
        discount: 0,
        total: 0,
      });
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate(
        "vendorId",
        "isBlocked"
      );

      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        return next(error);
      }

      if (product.vendorId?.isBlocked) {
        const error = new Error("Product unavailable");
        error.statusCode = 403;
        return next(error);
      }

      if (!product.isActive) {
        const error = new Error("Product unavailable");
        error.statusCode = 400;
        return next(error);
      }

      if (product.stock < item.quantity) {
        const error = new Error("Insufficient stock");
        error.statusCode = 400;
        return next(error);
      }

      let itemPrice = product.price;

      if (item.variant && product.variants?.length) {
        const variant = product.variants.find((v) =>
          v.options?.some((opt) => opt.value === item.variant)
        );

        const option = variant?.options?.find(
          (opt) => opt.value === item.variant
        );

        if (option?.priceModifier) {
          itemPrice += option.priceModifier;
        }
      }

      const itemTotal = itemPrice * item.quantity;

      subtotal += itemTotal;

      validatedItems.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0],
        quantity: item.quantity,
        price: itemPrice,
        total: itemTotal,
      });
    }

    const tax = Number((subtotal * 0.085).toFixed(2));
    const shippingCost = subtotal > 50 ? 0 : 5.99;

    let discount = 0;
    if (subtotal > 100) {
      discount = Number((subtotal * 0.1).toFixed(2));
    }

    const total = Number(
      (subtotal + tax + shippingCost - discount).toFixed(2)
    );

    res.json({
      items: validatedItems,
      subtotal,
      tax,
      shippingCost,
      discount,
      total,
    });
  } catch (error) {
    next(error);
  }
};