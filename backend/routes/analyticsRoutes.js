// Import express to create the router
const express = require('express');
const router  = express.Router();

// Import all analytics controller functions
const {
  getPlayerRankings,
  getPerformanceTrends,
  comparePlayers,
  searchTalents,
  getLeaderboards,
} = require('../controllers/analyticsController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// -----------------------------------------------
// 3.1 PLAYER RANKINGS
// GET /api/analytics/rankings
// All logged in users can view
// -----------------------------------------------
router.get('/rankings', protect, getPlayerRankings);

// -----------------------------------------------
// 3.2 PERFORMANCE TRENDS
// GET /api/analytics/trends/:playerId
// All logged in users can view
// -----------------------------------------------
router.get('/trends/:playerId', protect, getPerformanceTrends);

// -----------------------------------------------
// 3.3 PLAYER COMPARISON
// GET /api/analytics/compare?player1=id&player2=id
// All logged in users can view
// -----------------------------------------------
router.get('/compare', protect, comparePlayers);

// -----------------------------------------------
// 3.4 TALENT SEARCH
// GET /api/analytics/search
// All logged in users can search
// -----------------------------------------------
router.get('/search', protect, searchTalents);

// -----------------------------------------------
// 3.5 LEADERBOARDS
// GET /api/analytics/leaderboards
// All logged in users can view
// -----------------------------------------------
router.get('/leaderboards', protect, getLeaderboards);

// Export the router
module.exports = router;