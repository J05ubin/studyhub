const express = require('express');
const router = express.Router();
const { 
  submitQuizAttempt, 
  getDashboardAnalytics, 
  toggleBookmark, 
  getBookmarks 
} = require('../controllers/analyticsController');

// POST /api/analytics/quiz-submit
router.post('/quiz-submit', submitQuizAttempt);

// GET /api/analytics/dashboard
router.get('/dashboard', getDashboardAnalytics);

// POST /api/analytics/bookmarks
router.post('/bookmarks', toggleBookmark);

// GET /api/analytics/bookmarks
router.get('/bookmarks', getBookmarks);

module.exports = router;
