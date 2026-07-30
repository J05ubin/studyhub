const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // 'note', 'flashcard', 'mcq', 'flowchart', 'mindmap', etc.
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
