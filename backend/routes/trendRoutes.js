// Import express to create the router
const express = require('express');
const router  = express.Router();

// Import trend controller
const { getPerformanceTrend } = require('../controllers/trendController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// -----------------------------------------------
// GET PERFORMANCE TREND
// GET /api/trends/:playerId
// All logged in users can view trends
// -----------------------------------------------
router.get('/:playerId', protect, getPerformanceTrend);

// Export the router
module.exports = router;