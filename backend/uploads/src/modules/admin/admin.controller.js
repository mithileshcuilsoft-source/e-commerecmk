const Order = require("../../models/Order");
const User = require("../../models/user");
const Product = require("../../models/Product");

exports.getVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: "vendor" }).select("-password");
    if (!vendors.length) {
      return res.status(404).json({ message: "No vendors found" });
    }
    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

exports.getBlockedVendors = async (req, res, next) => {
  try {
    const vendors = await User.find({ role: "vendor", isBlocked: true }).select(
      "-password"
    );
    if (!vendors.length) {
      return res.status(404).json({ message: "No blocked vendors found" });
    }
    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

exports.blockVendor = async (req, res, next) => {
  try {
    const vendor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "vendor" },
      { isBlocked: true },
      { new: true }
    ).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ message: "Vendor blocked successfully", vendor });
  } catch (error) {
    next(error);
  }
};

exports.unblockVendor = async (req, res, next) => {
  try {
    const vendor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "vendor" },
      { isBlocked: false },
      { new: true }
    ).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({ message: "Vendor unblocked successfully", vendor });
  } catch (error) {
    next(error);
  }
};

exports.deleteVendor = async (req, res, next) => {
  try {
    const deletedVendor = await User.findOneAndDelete({
      _id: req.params.id,
      role: "vendor",
    });

    if (!deletedVendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("vendorId", "name email");
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("items.productId", "name price");
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getAllBuyers = async (req, res, next) => {
  try {
    const buyers = await User.find({ role: "buyer" }).select("-password");
    if (!buyers.length) {
      return res.status(404).json({ message: "No buyers found" });
    }
    res.json(buyers);
  } catch (error) {
    next(error);
  }
};
