const upload = require('../config/multer');

const handleSingleUpload = (fieldName = 'file') => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
      next();
    });
  };
};

module.exports = {
  handleSingleUpload
};
