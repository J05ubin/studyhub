const mongoose = require('mongoose');

const ChunkSchema = new mongoose.Schema({
  chunkIndex: { type: Number, required: true },
  text: { type: String, required: true },
  embedding: { type: [Number], default: [] }
});

const DocumentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  originalName: { type: String, required: true },
  fileType: { 
    type: String, 
    enum: ['PDF Notes', 'DOCX Notes', 'Text Files', 'Previous Year Question Papers (PYQs)', 'Syllabus Documents', 'General'],
    default: 'General'
  },
  mimeType: { type: String },
  size: { type: Number },
  extractedText: { type: String, default: '' },
  wordCount: { type: Number, default: 0 },
  chunks: [ChunkSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
