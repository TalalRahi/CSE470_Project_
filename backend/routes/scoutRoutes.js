// Import express to create the router
const express = require('express');
const router  = express.Router();

// Import all scout controller functions
const {
  sendScoutRequest,
  getMyScoutRequests,
  updateScoutStatus,
  getSentScoutRequests,
} = require('../controllers/scoutController');

// Import middleware
const {
  protect,
  authorizeRoles,
} = require('../middleware/authMiddleware');

// -----------------------------------------------
// SEND SCOUT REQUEST
// POST /api/scouts
// Only Coach can send scout requests
// -----------------------------------------------
router.post(
  '/',
  protect,
  authorizeRoles('Coach'),
  sendScoutRequest
);

// -----------------------------------------------
// GET MY SCOUT REQUESTS (received)
// GET /api/scouts/myrequests
// Only Players can view requests sent to them
// -----------------------------------------------
router.get(
  '/myrequests',
  protect,
  authorizeRoles('Player'),
  getMyScoutRequests
);

// -----------------------------------------------
// GET SENT SCOUT REQUESTS
// GET /api/scouts/sent
// Only Coach can view requests they sent
// -----------------------------------------------
router.get(
  '/sent',
  protect,
  authorizeRoles('Coach'),
  getSentScoutRequests
);

// -----------------------------------------------
// UPDATE SCOUT REQUEST STATUS
// PUT /api/scouts/:id
// Only Players can accept or reject
// -----------------------------------------------
router.put(
  '/:id',
  protect,
  authorizeRoles('Player'),
  updateScoutStatus
);

// Export the router
module.exports = router;