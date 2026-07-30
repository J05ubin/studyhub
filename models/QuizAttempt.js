const mongoose = require('mongoose');

const QuizAttemptSchema = new mongoose.Schema({
  title: { type: String, default: 'Quiz Attempt' },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  totalQuestions: { type: Number, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  skipped: { type: Number, default: 0 },
  accuracy: { type: Number, required: true },
  timeTakenSeconds: { type: Number, default: 0 },
  negativeMarks: { type: Number, default: 0 },
  topicPerformance: [{
    topic: String,
    total: Number,
    correct: Number,
    percentage: Number
  }],
  strongAreas: [String],
  weakAreas: [String],
  frequentlyIncorrectConcepts: [String],
  predictedExamReadiness: { type: Number, default: 75 },
  confidenceScore: { type: Number, default: 80 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuizAttempt', QuizAttemptSchema);
