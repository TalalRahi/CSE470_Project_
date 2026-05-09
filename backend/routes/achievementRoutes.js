// Import express to create the router
const express = require('express');
const router  = express.Router();

// Import all achievement controller functions
const {
  addAchievement,
  addMedia,
  updateVisibility,
} = require('../controllers/achievementController');

// Import middleware
const {
  protect,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// -----------------------------------------------
// ADD ACHIEVEMENT
// POST /api/achievements/:playerId
// Only Coach and Admin can add achievements
// -----------------------------------------------
router.post(
  '/:playerId',
  protect,
  authorizeRoles('Coach', 'Admin'),
  addAchievement
);

// -----------------------------------------------
// ADD MEDIA/HIGHLIGHT
// POST /api/achievements/:playerId/media
// Only Coach and Admin can add media
// -----------------------------------------------
router.post(
  '/:playerId/media',
  protect,
  authorizeRoles('Coach', 'Admin'),
  addMedia
);

// -----------------------------------------------
// UPDATE VISIBILITY
// PUT /api/achievements/:playerId/visibility
// Only Player can update their own visibility
// -----------------------------------------------
router.put(
  '/:playerId/visibility',
  protect,
  updateVisibility
);

// Export the router
module.exports = router;