const { generateFallbackContent } = require('./fallbackService');

exports.buildNotes = (topic) => {
  return generateFallbackContent('detailed-notes', topic);
};
