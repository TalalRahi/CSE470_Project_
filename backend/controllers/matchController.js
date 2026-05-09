// Import the Match model
const Match = require('../models/matchModel');

// -----------------------------------------------
// CREATE MATCH CONTROLLER
// Requirement 2.1 - Create Tournament/League/Friendly
// Requirement 2.2 - Register Teams & Squad
// Requirement 2.3 - Record Match Details
// POST /api/matches
// Only Coach and Admin can create matches
// -----------------------------------------------
const createMatch = async (req, res) => {
  try {
    // Get all match details from request body
    const {
      matchType,
      competitionName,
      round,
      matchDate,
      venue,
      homeTeam,
      awayTeam,
    } = req.body;

    // Create the match in database
    // createdBy is the logged in coach/admin's id
    // from the token via middleware
    const match = await Match.create({
      matchType,
      competitionName,
      round,
      matchDate,
      venue,
      homeTeam,
      awayTeam,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: 'Match created successfully ✅',
      match,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET ALL MATCHES CONTROLLER
// Requirement 2.5 - View Match History
// GET /api/matches
// All logged in users can view matches
// -----------------------------------------------
const getMatches = async (req, res) => {
  try {
    // Get all matches, newest first
    // populate createdBy to show coach name
    const matches = await Match.find()
      .populate('createdBy', 'name role')
      .populate('homeTeam.squad.player', 'name position')
      .populate('awayTeam.squad.player', 'name position')
      .sort({ matchDate: -1 });

    res.status(200).json({
      message: 'Matches fetched successfully ✅',
      count: matches.length,
      matches,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET SINGLE MATCH CONTROLLER
// GET /api/matches/:id
// -----------------------------------------------
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('createdBy', 'name role')
      .populate('homeTeam.squad.player', 'name position age')
      .populate('awayTeam.squad.player', 'name position age');

    if (!match) {
      return res.status(404).json({ message: 'Match not found ❌' });
    }

    res.status(200).json({
      message: 'Match fetched successfully ✅',
      match,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// UPDATE MATCH RESULT CONTROLLER
// Requirement 2.5 - Update Match Result
// PUT /api/matches/:id/result
// Only Coach and Admin can update result
// -----------------------------------------------
const updateMatchResult = async (req, res) => {
  try {
    // Get result details from request body
    const {
      homeGoals,
      awayGoals,
      status,
      notes,
    } = req.body;

    // Find the match
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found ❌' });
    }

    // Update goals scored by each team
    match.homeTeam.goalsScored = homeGoals;
    match.awayTeam.goalsScored = awayGoals;

    // Update match status
    match.status = status || 'Completed';

    // Update notes if provided
    if (notes) match.notes = notes;

    // Determine winner automatically based on goals
    if (homeGoals > awayGoals) {
      match.winner = 'Home';
    } else if (awayGoals > homeGoals) {
      match.winner = 'Away';
    } else {
      match.winner = 'Draw';
    }

    // Save updated match
    await match.save();

    res.status(200).json({
      message: 'Match result updated successfully ✅',
      match,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// UPDATE PLAYER STATS CONTROLLER
// Requirement 2.4 - Enter Player Match Stats
// PUT /api/matches/:id/stats
// Only Coach and Admin can update stats
// -----------------------------------------------
const updatePlayerStats = async (req, res) => {
  try {
    // req.body.team = 'home' or 'away'
    // req.body.playerId = player's MongoDB id
    // req.body.stats = { goals, assists, etc. }
    const { team, playerId, stats } = req.body;

    // Find the match
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found ❌' });
    }

    // Select the correct team (home or away)
    const selectedTeam = team === 'home'
      ? match.homeTeam
      : match.awayTeam;

    // Find the player in the squad list
    const playerStat = selectedTeam.squad.find(
      s => s.player.toString() === playerId
    );

    if (!playerStat) {
      return res.status(404).json({ message: 'Player not found in squad ❌' });
    }

    // Update the player's stats
    // Only update fields that were sent
    Object.assign(playerStat, stats);

    // Save the updated match
    await match.save();

    res.status(200).json({
      message: 'Player stats updated successfully ✅',
      match,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET MATCH HISTORY BY PLAYER
// Requirement 2.5 - View Match History (player level)
// GET /api/matches/player/:playerId
// -----------------------------------------------
const getMatchesByPlayer = async (req, res) => {
  try {
    const { playerId } = req.params;

    // Find all matches where this player
    // appears in either home or away squad
    const matches = await Match.find({
      $or: [
        { 'homeTeam.squad.player': playerId },
        { 'awayTeam.squad.player': playerId },
      ],
    })
      .populate('createdBy', 'name role')
      .sort({ matchDate: -1 });

    res.status(200).json({
      message: 'Player match history fetched ✅',
      count: matches.length,
      matches,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  createMatch,
  getMatches,
  getMatchById,
  updateMatchResult,
  updatePlayerStats,
  getMatchesByPlayer,
};