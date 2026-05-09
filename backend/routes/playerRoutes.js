// Import express to create the router
const express = require('express');
const router = express.Router();

// Import all player controller functions
const {
  addPlayer,
  getPlayers,
  getMyProfile,
  getPlayerById,
  updateMyProfile,
  updatePlayerSkills,
  addPerformance,
  deletePlayer,
} = require('../controllers/playerController');

// Import middleware
const {
  protect,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// -----------------------------------------------
// CREATE PROFILE
// POST /api/players
// Only Player and Admin can create profiles
// -----------------------------------------------
router.post(
  '/',
  protect,
  authorizeRoles('Player', 'Admin'),
  addPlayer
);

// -----------------------------------------------
// GET ALL PLAYERS
// GET /api/players
// All logged in users can view
// -----------------------------------------------
router.get(
  '/',
  protect,
  getPlayers
);

// -----------------------------------------------
// GET MY OWN PROFILE
// GET /api/players/myprofile
// Only Players use this route
// -----------------------------------------------
router.get(
  '/myprofile',
  protect,
  authorizeRoles('Player'),
  getMyProfile
);

// -----------------------------------------------
// UPDATE MY OWN BASIC INFO
// PUT /api/players/myprofile
// Only Players can update their own basic info
// -----------------------------------------------
router.put(
  '/myprofile',
  protect,
  authorizeRoles('Player'),
  updateMyProfile
);

// -----------------------------------------------
// GET SINGLE PLAYER
// GET /api/players/:id
// All logged in users can view
// -----------------------------------------------
router.get(
  '/:id',
  protect,
  getPlayerById
);

// -----------------------------------------------
// UPDATE PLAYER SKILLS
// PUT /api/players/:id/skills
// Only Coach and Admin can update skills
// -----------------------------------------------
router.put(
  '/:id/skills',
  protect,
  authorizeRoles('Coach', 'Admin'),
  updatePlayerSkills
);

// -----------------------------------------------
// ADD PERFORMANCE HISTORY
// POST /api/players/:id/performance
// Only Coach and Admin can add performance
// -----------------------------------------------
router.post(
  '/:id/performance',
  protect,
  authorizeRoles('Coach', 'Admin'),
  addPerformance
);

// -----------------------------------------------
// DELETE PLAYER
// DELETE /api/players/:id
// Only Admin can delete players
// -----------------------------------------------
router.delete(
  '/:id',
  protect,
  authorizeRoles('Admin'),
  deletePlayer
);

// Export the router
module.exports = router;