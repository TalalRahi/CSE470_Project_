// Import Scout model
const Scout  = require('../models/scoutModel');

// Import Player model
const Player = require('../models/playerModel');

// -----------------------------------------------
// SEND SCOUT REQUEST CONTROLLER
// Requirement 4.4 - Scout Request & Contact
// Only Coach can send scout requests
// POST /api/scouts
// -----------------------------------------------
const sendScoutRequest = async (req, res) => {
  try {
    const { playerId, message, contactEmail, contactPhone } = req.body;

    // Check if player exists
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    // Check if scout request already sent
    const existing = await Scout.findOne({
      player:    playerId,
      scoutedBy: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        message: 'You have already sent a scout request to this player ❌'
      });
    }

    // Create scout request
    const scoutRequest = await Scout.create({
      player:       playerId,
      scoutedBy:    req.user.id,
      message,
      contactEmail,
      contactPhone,
    });

    res.status(201).json({
      message:      'Scout request sent successfully ✅',
      scoutRequest,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET MY SCOUT REQUESTS CONTROLLER
// Player can see scout requests sent to them
// GET /api/scouts/myrequests
// -----------------------------------------------
const getMyScoutRequests = async (req, res) => {
  try {
    // Find the player profile of logged in user
    const player = await Player.findOne({ addedBy: req.user.id });

    if (!player) {
      return res.status(404).json({
        message: 'You need a player profile first ❌'
      });
    }

    // Find all scout requests for this player
    const requests = await Scout.find({ player: player._id })
      .populate('scoutedBy', 'name email role');

    res.status(200).json({
      message:  'Scout requests fetched ✅',
      count:    requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// UPDATE SCOUT REQUEST STATUS CONTROLLER
// Player can accept or reject scout requests
// PUT /api/scouts/:id
// -----------------------------------------------
const updateScoutStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Find the scout request
    const scoutRequest = await Scout.findById(req.params.id);

    if (!scoutRequest) {
      return res.status(404).json({ message: 'Scout request not found ❌' });
    }

    // Update the status
    scoutRequest.status = status;
    await scoutRequest.save();

    res.status(200).json({
      message:      'Scout request updated ✅',
      scoutRequest,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET ALL SCOUT REQUESTS CONTROLLER
// Coach can see all scout requests they sent
// GET /api/scouts/sent
// -----------------------------------------------
const getSentScoutRequests = async (req, res) => {
  try {
    const requests = await Scout.find({ scoutedBy: req.user.id })
      .populate('player', 'name position region club');

    res.status(200).json({
      message:  'Sent scout requests fetched ✅',
      count:    requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  sendScoutRequest,
  getMyScoutRequests,
  updateScoutStatus,
  getSentScoutRequests,
};