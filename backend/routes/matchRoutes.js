const express = require('express');
const router = express.Router();

// Import all match controller functions
const {
  createMatch,
  getMatches,
  getMatchById,
  updateMatchResult,
  updatePlayerStats,
  getMatchesByPlayer,
} = require('../controllers/matchController');

// Import middleware for protection and role checking
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// POST /api/matches - Create a match (Coach/Admin only)
router.post('/', protect, authorizeRoles('Coach', 'Admin'), createMatch);

// GET /api/matches - Get all matches (all logged in users)
router.get('/', protect, getMatches);

// GET /api/matches/player/:playerId - Get matches by player
router.get('/player/:playerId', protect, getMatchesByPlayer);

// GET /api/matches/:id - Get single match
router.get('/:id', protect, getMatchById);

// PUT /api/matches/:id/result - Update match result (Coach/Admin only)
router.put('/:id/result', protect, authorizeRoles('Coach', 'Admin'), updateMatchResult);

// PUT /api/matches/:id/stats - Update player stats (Coach/Admin only)
router.put('/:id/stats', protect, authorizeRoles('Coach', 'Admin'), updatePlayerStats);

module.exports = router;