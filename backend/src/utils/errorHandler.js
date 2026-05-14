const messages = require("./statusCodeMessage.js");

const errorHandler = (satusCode, res) => {
  return res.status(satusCode).json({
    success: false,
    message: messages[satusCode],
  });
};

module.exports = errorHandler;
