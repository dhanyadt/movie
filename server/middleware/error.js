// Centralized error handling middleware
const errorHandler = (err, req, res, _next) => {
  // Use status code set on response, or custom error property, defaulting to 500
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode);
  
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }

  res.json(response);
};

module.exports = errorHandler;
