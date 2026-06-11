const mongoose = require("mongoose");

const subscriptionSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      plan: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },

      stripeCustomerId: String,

      stripeSubscriptionId: String,
      stripeProductId: String,
      stripePriceId: String,
      price: Number,
      currency: { type: String, default: "usd" },

      status: {
        type: String,
        enum: [
          "active",
          "cancelled",
          "past_due",
          "incomplete",
          "incomplete_expired",
          "trialing",
          "unpaid",
        ],
        default: "active",
      },

      currentPeriodStart: Date,

      currentPeriodEnd: Date,
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);