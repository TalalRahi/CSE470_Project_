// Import Player model
const Player = require('../models/playerModel');

// -----------------------------------------------
// GET PERFORMANCE TREND CONTROLLER
// Requirement 3.2 - Performance Trend Analysis
// GET /api/trends/:playerId
// -----------------------------------------------
const getPerformanceTrend = async (req, res) => {
  try {
    const { playerId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Find the player
    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    // Get last N matches sorted by date (newest first)
    const history = player.performanceHistory
      .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))
      .slice(0, limit);

    // Calculate trend statistics
    if (history.length === 0) {
      return res.status(200).json({
        message: 'No performance history yet',
        playerName: player.name,
        position: player.position,
        trend: null,
        history: [],
      });
    }

    // Calculate averages
    const avgGoals   = (history.reduce((sum, m) => sum + (m.goals || 0), 0) / history.length).toFixed(2);
    const avgAssists = (history.reduce((sum, m) => sum + (m.assists || 0), 0) / history.length).toFixed(2);
    const avgRating  = (history.reduce((sum, m) => sum + (m.rating || 0), 0) / history.length).toFixed(1);
    const avgMinutes = Math.round(history.reduce((sum, m) => sum + (m.minutesPlayed || 0), 0) / history.length);

    // Calculate trend (improving or declining)
    const firstHalf = history.slice(Math.ceil(history.length / 2));
    const secondHalf = history.slice(0, Math.ceil(history.length / 2));

    const firstHalfAvgRating = firstHalf.length > 0
      ? (firstHalf.reduce((sum, m) => sum + (m.rating || 0), 0) / firstHalf.length).toFixed(1)
      : 0;

    const secondHalfAvgRating = secondHalf.length > 0
      ? (secondHalf.reduce((sum, m) => sum + (m.rating || 0), 0) / secondHalf.length).toFixed(1)
      : 0;

    const trendStatus = parseFloat(secondHalfAvgRating) > parseFloat(firstHalfAvgRating)
      ? '📈 Improving'
      : parseFloat(secondHalfAvgRating) < parseFloat(firstHalfAvgRating)
      ? '📉 Declining'
      : '➡️ Stable';

    res.status(200).json({
      message: 'Performance trend fetched ✅',
      playerName: player.name,
      position: player.position,
      matchesAnalyzed: history.length,
      trend: {
        status: trendStatus,
        avgGoals: parseFloat(avgGoals),
        avgAssists: parseFloat(avgAssists),
        avgRating: parseFloat(avgRating),
        avgMinutes,
      },
      history,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = { getPerformanceTrend };