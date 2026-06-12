let stripeInstance = null;

const getStripe = () => {
  if (stripeInstance) return stripeInstance;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    console.error("CRITICAL WARNING: STRIPE_SECRET_KEY is not defined. Payments and subscriptions will not work, but server is staying online.");
    return null;
  }
  stripeInstance = require("stripe")(stripeKey);
  return stripeInstance;
};

const Order = require("../../models/Order");
const Product = require("../../models/Product");

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const stripe = getStripe();
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate("items.productId").populate("userId");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
const lineItems = order.items.map((item) => ({
  price_data: {
    currency: "usd",
    product_data: {
      name: item.productId.name,
      images: item.productId.images?.length
        ? [item.productId.images[0]]
        : [],
    },
    unit_amount: Math.round(item.price * 100),
    recurring: { interval: 'month' },
  },
  quantity: item.quantity,
}));


if (order.shippingCost > 0) {
  lineItems.push({
    price_data: {
      currency: "usd",
      product_data: {
        name: "Shipping Fee",
      },
      unit_amount: Math.round(order.shippingCost * 100),
      recurring: { interval: 'month' },
    },
    quantity: 1,
  });
}

    // Add tax if any
if (order.tax > 0) {
  lineItems.push({
    price_data: {
      currency: "usd",
      product_data: {
        name: "Tax",
      },
      unit_amount: Math.round(order.tax * 100),
      recurring: { interval: 'month' },
    },
    quantity: 1,
  });
}

    // Handle discount if any
// REMOVE THIS ENTIRE BLOCK
// if (order.discount > 0) {
//   lineItems.push({
//     price_data: {
//       currency: "usd",
//       product_data: {
//         name: "Discount",
//       },
//       unit_amount: -Math.round(order.discount * 100),
//     },
//     quantity: 1,
//   });
// }
    console.log("LINE ITEMS");
    console.log(JSON.stringify(lineItems, null, 2));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "subscription",
      customer_email: order.userId.email,
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?orderId=${order._id}`,
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id.toString(),
      },
    });

    res.json({ success: true, url: session.url, sessionId: session.id });

  } catch (error) {
    console.error("STRIPE SESSION ERROR:", error);
    next(error);
  }
};

exports.stripeWebhook = async (req, res) => {
  console.log("SIGNATURE:", req.headers["stripe-signature"]);
  console.log("WEBHOOK SECRET:", process.env.STRIPE_WEBHOOK_SECRET);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(` Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(` Received Stripe Event: ${event.type}`);

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      
      // Handle Order Payment
      if (session.mode === "payment") {
        const orderId = session.metadata.orderId;
        try {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "paid",
            paymentDetails: {
              sessionId: session.id,
              paymentIntentId: session.payment_intent,
              amountTotal: session.amount_total / 100,
              currency: session.currency,
            },
          });
          console.log(`Order ${orderId} marked as paid.`);
        } catch (error) {
          console.error(" Error updating order on webhook:", error);
        }
      } 
      
      // Handle Subscription
      if (session.mode === "subscription") {
        const userId = session.metadata.userId;
        const planId = session.metadata.planId;
        const orderId = session.metadata.orderId;
        const stripeSubscriptionId = session.subscription;
        const stripeCustomerId = session.customer;

        const Subscription = require("../../models/Subscription");
        const stripe = getStripe();
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const price = subscription.items.data[0].price;

        const updateData = {
          stripeSubscriptionId,
          stripeCustomerId,
          stripePriceId: price.id,
          stripeProductId: price.product,
          price: price.unit_amount / 100,
          currency: price.currency,
          status: "active",
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        };

        // If planId is a valid MongoDB ID, link it
        if (planId && planId.match(/^[0-9a-fA-F]{24}$/)) {
          updateData.plan = planId;
        }

        try {
          // Update Subscription
          await Subscription.findOneAndUpdate(
            { user: userId },
            updateData,
            { upsert: true, new: true }
          );
          console.log(`Subscription for user ${userId} activated.`);

          // If this subscription is tied to an order, mark the order as paid
          if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
              paymentStatus: "paid",
              paymentDetails: {
                sessionId: session.id,
                paymentIntentId: session.payment_intent, // Note: For subscriptions, this might be null in the initial session, but usually handled by invoice.paid
                amountTotal: session.amount_total / 100,
                currency: session.currency,
              },
            });
            console.log(`Order ${orderId} marked as paid via subscription.`);
          }
        } catch (error) {
          console.error(" Error updating subscription/order on webhook:", error);
        }
      }

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const Subscription = require("../../models/Subscription");
      try {
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }
        );
        console.log(`Subscription ${subscription.id} updated to ${subscription.status}`);
      } catch (error) {
        console.error(" Error updating subscription on update event:", error);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const Subscription = require("../../models/Subscription");
      try {
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          { status: "cancelled" }
        );
        console.log(`Subscription ${subscription.id} cancelled.`);
      } catch (error) {
        console.error(" Error updating subscription on delete event:", error);
      }
      break;
    }

    case "checkout.session.async_payment_failed":
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        try {
          await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "failed",
          });
          console.log(`Order ${orderId} payment failed.`);
        } catch (error) {
          console.error("Error updating order status on failure:", error);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
