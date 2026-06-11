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

exports.createCheckoutSession = async (planId, userId) => {
  let stripePriceId = planId;

  // Check if planId is a MongoDB ID, if so get the stripePriceId
  if (planId.match(/^[0-9a-fA-F]{24}$/)) {
    const plan = await Plan.findById(planId);
    if (plan) {
      stripePriceId = plan.stripePriceId;
    }
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
      planId: planId, // Keep original ID for tracking
    },
  });

  return session;
};