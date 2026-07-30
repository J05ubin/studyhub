const { generateFallbackContent } = require('../services/fallbackService');

exports.generateNotes = async (req, res) => {
  try {
    const { topic = 'Core Concepts' } = req.body;
    const notes = generateFallbackContent('detailed-notes', topic);
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
