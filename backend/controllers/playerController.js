// Import the Player model to interact with
// the players collection in MongoDB
const Player = require('../models/playerModel');

// -----------------------------------------------
// ADD OWN PROFILE CONTROLLER
// A Player can create their OWN profile
// Admin can also add a player profile
// POST /api/players
// -----------------------------------------------
const addPlayer = async (req, res) => {
  try {
    const {
      name,
      age,
      region,
      club,
      photo,
      height,
      weight,
      medicalHistory,
      position,
      dominantFoot,
    } = req.body;

    // If logged in user is a Player,
    // they can only create ONE profile for themselves
    if (req.user.role === 'Player') {
      const existingProfile = await Player.findOne({
        addedBy: req.user.id
      });

      if (existingProfile) {
        return res.status(400).json({
          message: 'You already have a profile ❌'
        });
      }
    }

    // Create the player profile
    const player = await Player.create({
      name,
      age,
      region,
      club,
      photo,
      height,
      weight,
      medicalHistory,
      position,
      dominantFoot,
      addedBy: req.user.id,
    });

    res.status(201).json({
      message: 'Player profile created successfully ✅',
      player,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET ALL PLAYERS CONTROLLER
// All logged in users can view players
// GET /api/players
// -----------------------------------------------
const getPlayers = async (req, res) => {
  try {
    const players = await Player.find()
      .populate('addedBy', 'name email role');

    res.status(200).json({
      message: 'Players fetched successfully ✅',
      count: players.length,
      players,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET MY PROFILE CONTROLLER
// A Player can get their own profile
// GET /api/players/myprofile
// -----------------------------------------------
const getMyProfile = async (req, res) => {
  try {
    const player = await Player.findOne({ addedBy: req.user.id })
      .populate('addedBy', 'name email role');

    if (!player) {
      return res.status(404).json({
        message: 'You do not have a profile yet ❌'
      });
    }

    res.status(200).json({
      message: 'Profile fetched successfully ✅',
      player,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// GET SINGLE PLAYER CONTROLLER
// GET /api/players/:id
// -----------------------------------------------
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('addedBy', 'name email role');

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    res.status(200).json({
      message: 'Player fetched successfully ✅',
      player,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// UPDATE OWN BASIC INFO CONTROLLER
// A Player can only update their OWN basic info
// PUT /api/players/myprofile
// -----------------------------------------------
const updateMyProfile = async (req, res) => {
  try {
    const player = await Player.findOne({ addedBy: req.user.id });

    if (!player) {
      return res.status(404).json({
        message: 'You do not have a profile yet ❌'
      });
    }

    // Player can only update basic info
    const {
      name,
      age,
      region,
      club,
      photo,
      height,
      weight,
      medicalHistory,
      position,
      dominantFoot,
    } = req.body;

    if (name)           player.name           = name;
    if (age)            player.age            = age;
    if (region)         player.region         = region;
    if (club)           player.club           = club;
    if (photo)          player.photo          = photo;
    if (height)         player.height         = height;
    if (weight)         player.weight         = weight;
    if (medicalHistory) player.medicalHistory = medicalHistory;
    if (position)       player.position       = position;
    if (dominantFoot)   player.dominantFoot   = dominantFoot;

    await player.save();

    res.status(200).json({
      message: 'Profile updated successfully ✅',
      player,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// UPDATE PLAYER SKILLS CONTROLLER
// Only Coach and Admin can update skills
// PUT /api/players/:id/skills
// -----------------------------------------------
const updatePlayerSkills = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    const { skills } = req.body;
    if (skills) player.skills = skills;

    await player.save();

    res.status(200).json({
      message: 'Player skills updated successfully ✅',
      player,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// ADD PERFORMANCE HISTORY CONTROLLER
// Only Coach and Admin can add performance
// POST /api/players/:id/performance
// -----------------------------------------------
const addPerformance = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    const {
      matchName,
      matchDate,
      opponent,
      minutesPlayed,
      goals,
      assists,
      yellowCards,
      redCards,
      rating,
      notes,
    } = req.body;

    player.performanceHistory.push({
      matchName,
      matchDate,
      opponent,
      minutesPlayed,
      goals,
      assists,
      yellowCards,
      redCards,
      rating,
      notes,
    });

    await player.save();

    res.status(201).json({
      message: 'Performance added successfully ✅',
      performanceHistory: player.performanceHistory,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// DELETE PLAYER CONTROLLER
// Only Admin can delete a player profile
// DELETE /api/players/:id
// -----------------------------------------------
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    res.status(200).json({
      message: 'Player deleted successfully ✅',
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  addPlayer,
  getPlayers,
  getMyProfile,
  getPlayerById,
  updateMyProfile,
  updatePlayerSkills,
  addPerformance,
  deletePlayer,
};