const { generateFallbackContent } = require('../services/fallbackService');

exports.analyzePYQ = async (req, res) => {
  try {
    const { topic = 'Exam PYQs' } = req.body;
    const pyqs = generateFallbackContent('pyq-analyzer', topic);
    res.json({ success: true, pyqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
