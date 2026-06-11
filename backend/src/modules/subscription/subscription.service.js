const Stripe = require("stripe");
const Plan = require("../../models/Plan");

const stripe = Stripe(
  process.env.STRIPE_SECRET_KEY
);

exports.getStripePlans = async () => {
  const products = await stripe.products.list({ 
    active: true,
    expand: ['data.default_price', 'data.marketing_features'] 
  });

  return products.data.map((product) => {
    // Get price from expanded default_price or fetch separately if needed
    const price = product.default_price;
    
    return {
      _id: product.id,
      name: product.name,
      description: product.description || "No description provided in Stripe",
      price: price ? price.unit_amount / 100 : 0,
      billingCycle: price?.recurring?.interval === "year" ? "yearly" : (price?.recurring?.interval || "monthly"),
      stripePriceId: price ? price.id : null,
      // Map Stripe Marketing Features to a simple string array
      features: (product.marketing_features || []).map(f => f.name).length > 0 
        ? product.marketing_features.map(f => f.name)
        : (product.metadata.features ? JSON.parse(product.metadata.features) : []),
      active: product.active,
    };
  });
};

exports.createCheckoutSession = async (id, userId) => {
  let stripePriceId = id;

  // 1. If it's a MongoDB ID, find the plan in our DB
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    const plan = await Plan.findById(id);
    if (plan) {
      stripePriceId = plan.stripePriceId;
    }
  } 
  // 2. If it's a Stripe Product ID (starts with prod_), get its default price
  else if (id.startsWith("prod_")) {
    const product = await stripe.products.retrieve(id);
    stripePriceId = product.default_price;
    
    if (!stripePriceId) {
      // Fallback: try to find any active price for this product
      const prices = await stripe.prices.list({ product: id, active: true, limit: 1 });
      if (prices.data.length > 0) {
        stripePriceId = prices.data[0].id;
      }
    }
  }

  if (!stripePriceId) {
    throw new Error("Could not find a valid Stripe Price for the selected plan.");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND_URL}/subscription/success`,
    cancel_url: `${process.env.FRONTEND_URL}/subscription`,
    metadata: {
      userId,
      planId: id,
    },
  });

  return session;
};