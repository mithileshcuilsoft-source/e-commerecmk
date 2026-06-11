const User =
  require("../models/User");

module.exports =
  async (req, res, next) => {

    const user =
      await User.findById(
        req.user.id
      );

    if (
      !user ||
      !user.isPremium
    ) {

      return res.status(403).json({
        success: false,
        message:
          "Premium subscription required",
      });

    }

    next();
  };