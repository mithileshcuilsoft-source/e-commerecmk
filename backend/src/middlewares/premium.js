const Subscription = require("../models/Subscription");

exports.isPremium = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: "active",
    });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        message: "Premium subscription required to access this feature",
      });
    }

    // Check if subscription has expired
    if (subscription.currentPeriodEnd < new Date()) {
        subscription.status = "past_due";
        await subscription.save();
        return res.status(403).json({
            success: false,
            message: "Subscription expired. Please renew to continue.",
        });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error during subscription verification",
    });
  }
};
