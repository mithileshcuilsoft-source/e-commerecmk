// models/Address.js
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String,
    enum: ["home", "work", "other"],
    default: "home"
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pinCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: "India"
  },
  isDefault: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Address", addressSchema);