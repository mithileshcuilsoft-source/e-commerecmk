
const Address = require("../../models/Address");
const User = require("../../models/user");

exports.migrateAddressTypes = async (req, res, next) => {
  try {
    const result = await Address.updateMany(
      { type: { $in: ["Home", "Work", "Other"] } },
      [
        {
          $set: {
            type: {
              $switch: {
                branches: [
                  { case: { $eq: ["$type", "Home"] }, then: "home" },
                  { case: { $eq: ["$type", "Work"] }, then: "work" },
                  { case: { $eq: ["$type", "Other"] }, then: "other" }
                ],
                default: "$type"
              }
            }
          }
        }
      ]
    );

    res.json({ message: `Migrated ${result.modifiedCount} addresses` });
  } catch (error) {
    next(error);
  }
};

exports.addAddress = async (req, res, next) => {
  try {
    const { type, street, city, state, pinCode, country, isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id },
        { isDefault: false }
      );
    }

    const address = await Address.create({
      userId: req.user.id,
      type: type?.toLowerCase(),
      street,
      city,
      state,
      pinCode,
      country,
      isDefault
    });
    await User.findByIdAndUpdate(req.user.id, {
      $push: { addresses: address._id }
    });

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    res.json(addresses);
  } catch (error) {
    next(error);
  }
};

exports.getAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(address);
  } catch (error) {
    next(error);
  }
};

// Update an address
exports.updateAddress = async (req, res, next) => {
  try {
    const { type, street, city, state, pinCode, country, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Address.updateMany(
        { userId: req.user.id, _id: { $ne: req.params.id } },
        { isDefault: false }
      );
    }

    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { type: type?.toLowerCase(), street, city, state, pinCode, country, isDefault },
      { new: true }
    );

    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(address);
  } catch (error) {
    next(error);
  }
};

// Delete an address
exports.deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }

    // Remove from user's addresses array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { addresses: req.params.id }
    });

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Set default address
exports.setDefaultAddress = async (req, res, next) => {
  try {
    // Unset all defaults first
    await Address.updateMany(
      { userId: req.user.id },
      { isDefault: false }
    );

    // Set the specified address as default
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isDefault: true },
      { new: true }
    );

    if (!address) {
      const error = new Error("Address not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(address);
  } catch (error) {
    next(error);
  }
};