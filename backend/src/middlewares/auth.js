
  const jwt = require("jsonwebtoken");
  const User = require("../models/user");

  exports.protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) return res.status(401).json({ msg: "No token" });
    if (token.startsWith("Bearer ")) token = token.slice(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      const user = await User.findById(decoded.id);

      if (!user) return res.status(401).json({ msg: "Invalid token" });
      if (user.role === "vendor" && user.isBlocked) {
        return res.status(403).json({ msg: "Vendor is blocked" });
      }

      req.user = { id: user._id.toString(), role: user.role };
      next();
    } catch (err) {
      return res.status(401).json({ msg: "Invalid token" });
    }
  };

  exports.role = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ msg: "Access denied" });
      }
      next();
    };
  };