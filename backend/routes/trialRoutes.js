// Import express to create the router
const express = require('express');
const router  = express.Router();

// Import all trial controller functions
const {
  createTrial,
  getTrials,
  applyForTrial,
  updateApplicationStatus,
  getMyApplications,
} = require('../controllers/trialController');

// Import middleware
const {
  protect,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// -----------------------------------------------
// CREATE TRIAL
// POST /api/trials
// Only Coach and Admin can create trials
// -----------------------------------------------
router.post(
  '/',
  protect,
  authorizeRoles('Coach', 'Admin'),
  createTrial
);

// -----------------------------------------------
// GET ALL TRIALS
// GET /api/trials
// All logged in users can view trials
// -----------------------------------------------
router.get('/', protect, getTrials);

// -----------------------------------------------
// GET MY APPLICATIONS
// GET /api/trials/myapplications
// Only Players can view their applications
// -----------------------------------------------
router.get(
  '/myapplications',
  protect,
  authorizeRoles('Player'),
  getMyApplications
);

// -----------------------------------------------
// APPLY FOR TRIAL
// POST /api/trials/:id/apply
// Only Players can apply
// -----------------------------------------------
router.post(
  '/:id/apply',
  protect,
  authorizeRoles('Player'),
  applyForTrial
);

// -----------------------------------------------
// UPDATE APPLICATION STATUS
// PUT /api/trials/:id/applications/:appId
// Only Coach and Admin can update status
// -----------------------------------------------
router.put(
  '/:id/applications/:appId',
  protect,
  authorizeRoles('Coach', 'Admin'),
  updateApplicationStatus
);

// Export the router
module.exports = router;