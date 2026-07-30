const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadDocument, getAllDocuments, deleteDocument } = require('../controllers/documentController');

// POST /api/documents/upload
router.post('/upload', upload.single('file'), uploadDocument);

// GET /api/documents
router.get('/', getAllDocuments);

// DELETE /api/documents/:id
router.delete('/:id', deleteDocument);

module.exports = router;
