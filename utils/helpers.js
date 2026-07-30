exports.formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

exports.sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim();
};
