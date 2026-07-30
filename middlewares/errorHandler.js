/**
 * Global Express Error Handling Middleware
 */
module.exports = (err, req, res, next) => {
  console.error('[Error Handler]', err.stack || err.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
