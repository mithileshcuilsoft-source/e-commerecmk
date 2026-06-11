require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("../models/Plan");

const plans = [
  {
    name: "Basic Membership",
    description: "Essential features for casual shoppers",
    price: 7.55,
    billingCycle: "yearly",
    stripePriceId: "price_1TgkSYKGXhXvXS83Z60jK2Gk",
    features: [
      "Access to premium content",
      "Standard shipping on all orders",
      "Member-only exclusive deals",
    ],
    active: true,
  },
  {
    name: "Pro Membership",
    description: "Best for frequent shoppers and enthusiasts",
    price: 10.59,
    billingCycle: "yearly",
    stripePriceId: "price_1TgkUEKGXhXvXS83oOuD3Ke0",
    features: [
        "All Basic features",
        "Fast & Free shipping",
        "Priority customer support",
        "Early access to lightning deals",
    ],
    active: true,
  },
  {
    name: "Enterprise",
    description: "The ultimate shopping experience for power users",
    price: 15.69,
    billingCycle: "yearly",
    stripePriceId: "price_1TgkWJKGXhXvXS83EqPuF6dF",
    features: [
        "All Pro features",
        "Unlimited free returns",
        "Personal shopping assistant",
        "Exclusive luxury collection access",
    ],
    active: true,
  },
];

const seedPlans = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Optional: Clear existing plans
    // await Plan.deleteMany({});

    for (const plan of plans) {
      await Plan.findOneAndUpdate({ name: plan.name }, plan, {
        upsert: true,
        new: true,
      });
    }

    console.log("Plans seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding plans:", error);
    process.exit(1);
  }
};

// Only run if called directly
if (require.main === module) {
  seedPlans();
}
