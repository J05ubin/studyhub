const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const { generateFallbackContent } = require('../services/fallbackService');

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json({ success: true, quizzes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { topic = 'General Study' } = req.body;
    const content = generateFallbackContent('mcq-generator', topic);
    res.json({ success: true, quiz: content });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
