// Import Player model
const Player = require('../models/playerModel');

// -----------------------------------------------
// ADD ACHIEVEMENT CONTROLLER
// Requirement 4.5 - Achievement/Certificate Showcase
// POST /api/achievements/:playerId
// -----------------------------------------------
const addAchievement = async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    // Find the player
    const player = await Player.findById(req.params.playerId);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    // Add achievement to array
    player.achievements.push({
      title,
      description,
      icon: icon || '🏆',
    });

    await player.save();

    res.status(201).json({
      message: 'Achievement added successfully ✅',
      achievements: player.achievements,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// ADD MEDIA/HIGHLIGHT CONTROLLER
// Requirement 4.1 - Highlight & Media Upload
// POST /api/achievements/:playerId/media
// -----------------------------------------------
const addMedia = async (req, res) => {
  try {
    const { title, url, type } = req.body;

    // Find the player
    const player = await Player.findById(req.params.playerId);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    // Add media to array
    player.mediaHighlights.push({
      title,
      url,
      type: type || 'video',
    });

    await player.save();

    res.status(201).json({
      message: 'Media added successfully ✅',
      mediaHighlights: player.mediaHighlights,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// UPDATE VISIBILITY CONTROLLER
// Requirement 4.3 - Player Visibility Settings
// PUT /api/achievements/:playerId/visibility
// -----------------------------------------------
const updateVisibility = async (req, res) => {
  try {
    const { visibility } = req.body;

    // Find the player
    const player = await Player.findById(req.params.playerId);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    // Update visibility
    player.visibility = visibility;
    await player.save();

    res.status(200).json({
      message: 'Visibility updated successfully ✅',
      visibility: player.visibility,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  addAchievement,
  addMedia,
  updateVisibility,
};