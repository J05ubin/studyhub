const express = require('express');
const router = express.Router();
const { handleAIToolRequest } = require('../controllers/aiToolController');
// POST /api/ai/:toolType - Universal endpoint for all AI Study tools
router.post('/:toolType', handleAIToolRequest);

module.exports = router;
