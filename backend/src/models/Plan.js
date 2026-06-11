const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
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
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },

    stripePriceId: {
      type: String,
      required: true,
    },

    features: [
      {
        type: String,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Plan",
  planSchema
);