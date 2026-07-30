const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalQuizzesTaken: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 },
  totalNotesGenerated: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);
