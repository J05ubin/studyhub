const QuizAttempt = require('../models/QuizAttempt');

exports.getUserMetrics = async (userId) => {
  const attempts = await QuizAttempt.find(userId ? { userId } : {});
  const total = attempts.length;
  const avgAccuracy = total > 0 ? Math.round(attempts.reduce((sum, a) => sum + (a.accuracy || 0), 0) / total) : 0;
  return { totalQuizzes: total, avgAccuracy };
};
