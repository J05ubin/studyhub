const fs = require('fs');
const Document = require('../models/Document');
const { getIsConnected } = require('../config/db');
const { extractTextFromFile } = require('../services/fileParserService');
const { splitTextIntoChunks } = require('../utils/textSplitter');
const { generateEmbedding } = require('../services/embeddingService');

// In-memory document storage fallback when MongoDB connection is not active
const inMemoryDocuments = [];

/**
 * Handle document upload and process text extraction & vector embeddings
 */
async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file provided.' });
    }

    const { originalname, path: filePath, mimetype, size } = req.file;
    const documentType = req.body.fileType || 'General';

    console.log(`[UploadController] Uploading ${originalname} (${mimetype}, ${size} bytes) - Category: ${documentType}`);

    // 1. Extract text
    const extractedText = await extractTextFromFile(filePath, mimetype, originalname);
    const wordCount = extractedText ? extractedText.split(/\s+/).length : 0;

    // 2. Chunk text
    const rawChunks = splitTextIntoChunks(extractedText, 350, 50);

    // 3. Generate embeddings for chunks
    const chunks = [];
    for (const chunkObj of rawChunks) {
      const embedding = await generateEmbedding(chunkObj.text);
      chunks.push({
        chunkIndex: chunkObj.chunkIndex,
        text: chunkObj.text,
        embedding
      });
    }

    const docTitle = req.body.title || originalname.replace(/\.[^/.]+$/, "");

    let newDocument;

    if (getIsConnected()) {
      newDocument = new Document({
        title: docTitle,
        originalName: originalname,
        fileType: documentType,
        mimeType: mimetype,
        size,
        extractedText,
        wordCount,
        chunks
      });
      await newDocument.save();
    } else {
      // In-memory fallback
      newDocument = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        title: docTitle,
        originalName: originalname,
        fileType: documentType,
        mimeType: mimetype,
        size,
        extractedText,
        wordCount,
        chunks,
        createdAt: new Date()
      };
      inMemoryDocuments.unshift(newDocument);
    }

    // Clean temporary upload file
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.warn('Could not remove temp file:', e.message);
    }

    return res.status(201).json({
      message: 'Document processed and indexed successfully!',
      document: {
        id: newDocument._id || newDocument.id,
        title: newDocument.title,
        originalName: newDocument.originalName,
        fileType: newDocument.fileType,
        wordCount: newDocument.wordCount,
        chunkCount: chunks.length,
        createdAt: newDocument.createdAt
      }
    });

  } catch (error) {
    console.error('[UploadController] Processing error:', error);
    return res.status(500).json({ error: `File processing failed: ${error.message}` });
  }
}

/**
 * Get list of all uploaded documents
 */
async function getAllDocuments(req, res) {
  try {
    let docs = [];
    if (getIsConnected()) {
      docs = await Document.find().select('title originalName fileType wordCount size createdAt').sort({ createdAt: -1 });
    } else {
      docs = inMemoryDocuments.map(d => ({
        _id: d._id,
        title: d.title,
        originalName: d.originalName,
        fileType: d.fileType,
        wordCount: d.wordCount,
        size: d.size,
        createdAt: d.createdAt
      }));
    }

    return res.json({ documents: docs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Delete a document by ID
 */
async function deleteDocument(req, res) {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await Document.findByIdAndDelete(id);
    } else {
      const idx = inMemoryDocuments.findIndex(d => d._id === id);
      if (idx !== -1) inMemoryDocuments.splice(idx, 1);
    }
    return res.json({ message: 'Document deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Helper to fetch documents for RAG processing
 */
async function getDocumentsForRAG(documentId = null) {
  if (documentId && documentId !== 'all') {
    if (getIsConnected()) {
      const doc = await Document.findById(documentId);
      return doc ? [doc] : [];
    } else {
      const doc = inMemoryDocuments.find(d => d._id === documentId);
      return doc ? [doc] : [];
    }
  }

  // Fetch all documents
  if (getIsConnected()) {
    return await Document.find();
  } else {
    return inMemoryDocuments;
  }
}

module.exports = {
  uploadDocument,
  getAllDocuments,
  deleteDocument,
  getDocumentsForRAG
};
