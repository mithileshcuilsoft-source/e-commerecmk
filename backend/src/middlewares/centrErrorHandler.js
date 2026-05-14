const centrErrorHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      success: false,
      messages: 'Invalid JSON payload',
    });
  }

  res.status(500).json({
    success: false,
    messages: error.message || 'network error',
  });
};

module.exports = centrErrorHandler;
