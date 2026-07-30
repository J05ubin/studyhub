const { generateFallbackContent } = require('./fallbackService');

exports.buildQuiz = (topic) => {
  return generateFallbackContent('mcq-generator', topic);
};
