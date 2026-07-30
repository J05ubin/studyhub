const mongoose = require('mongoose');

const generatedContentSchema = new mongoose.Schema({
  toolType: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GeneratedContent', generatedContentSchema);
