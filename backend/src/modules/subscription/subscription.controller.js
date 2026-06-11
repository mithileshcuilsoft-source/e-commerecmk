const Plan = require("../../models/Plan");
const Subscription =
  require("../../models/Subscription");

const subscriptionService =
  require("./subscription.service");

exports.getPlans = async (req, res) => {
  try {
    const plans = await subscriptionService.getStripePlans();
    res.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("GET PLANS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch plans from Stripe",
      error: error.message,
    });
  }
};

exports.createCheckout =
  async (req, res) => {
    try {
      const { planId } = req.body;
      const session =await subscriptionService.createCheckoutSession(planId,req.user.id);
      res.status(200).json({
        success: true,
        url: session.url,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

exports.mySubscription =
  async (req, res) => {
      const subscription =await Subscription.findOne({
        user: req.user.id,
      }).populate("plan");
    res.status(200).json({
      success: true,
      data: subscription,
    });
  };