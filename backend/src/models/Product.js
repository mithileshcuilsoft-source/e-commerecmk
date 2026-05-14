// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  variants: [
    {
      name: String,
      options: [
        {
          value: String,
          priceModifier: {
            type: Number,
            default: 0,
          },
          stock: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
