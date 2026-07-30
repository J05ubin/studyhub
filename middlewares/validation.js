/**
 * Express Request Body Validation Middleware
 */
const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required field(s): ${missing.join(', ')}`
      });
    }
    next();
  };
};

module.exports = {
  validateBody
};
