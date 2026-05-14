const validate = (schema) => async (req, res, next) => {
  try {
    if (!schema) {
      return res.status(500).json({
        success: false,
        message: "Validation schema missing",
      });
    }

    req.body = await schema.parseAsync(req.body);

    next();
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
  }
};

module.exports = validate;