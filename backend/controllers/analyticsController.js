// Import Player model to analyze player data
const Player = require('../models/playerModel');

// -----------------------------------------------
// 3.1 PLAYER RANKING SYSTEM
// Ranks players by position based on their
// average skill rating
// GET /api/analytics/rankings
// -----------------------------------------------
const getPlayerRankings = async (req, res) => {
  try {
    // Get all players with their skills
    const players = await Player.find()
      .populate('addedBy', 'name role');

    // Calculate average skill rating for each player
    const rankings = players.map(player => {
      const skills = player.skills;

      // Calculate average of all skills
      const avgSkill = skills
        ? (
            (skills.dribbling || 0) +
            (skills.passing    || 0) +
            (skills.tackling   || 0) +
            (skills.shooting   || 0) +
            (skills.pace       || 0) +
            (skills.stamina    || 0)
          ) / 6
        : 0;

      return {
        _id:          player._id,
        name:         player.name,
        position:     player.position,
        region:       player.region,
        club:         player.club,
        age:          player.age,
        skills:       player.skills,
        avgSkill:     Math.round(avgSkill),
        addedBy:      player.addedBy,
      };
    });

    // Sort by average skill rating (highest first)
    rankings.sort((a, b) => b.avgSkill - a.avgSkill);

    res.status(200).json({
      message: 'Player rankings fetched ✅',
      rankings,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// 3.2 PERFORMANCE TREND ANALYSIS
// Shows last 5 or 10 matches of a player
// GET /api/analytics/trends/:playerId
// -----------------------------------------------
const getPerformanceTrends = async (req, res) => {
  try {
    const { playerId } = req.params;

    // How many matches to show (default 5)
    const limit = parseInt(req.query.limit) || 5;

    // Find the player
    const player = await Player.findById(playerId);

    if (!player) {
      return res.status(404).json({ message: 'Player not found ❌' });
    }

    // Get last N matches from performance history
    // Sort by match date newest first
    const history = player.performanceHistory
      .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate))
      .slice(0, limit);

    // Calculate totals and averages
    const totalGoals   = history.reduce((sum, m) => sum + m.goals, 0);
    const totalAssists = history.reduce((sum, m) => sum + m.assists, 0);
    const avgRating    = history.length
      ? (history.reduce((sum, m) => sum + m.rating, 0) / history.length).toFixed(1)
      : 0;
    const avgMinutes   = history.length
      ? Math.round(history.reduce((sum, m) => sum + m.minutesPlayed, 0) / history.length)
      : 0;

    res.status(200).json({
      message:    'Performance trends fetched ✅',
      playerName: player.name,
      position:   player.position,
      limit,
      summary: {
        totalGoals,
        totalAssists,
        avgRating,
        avgMinutes,
      },
      history,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// 3.3 PLAYER COMPARISON TOOL
// Compares two players of the same position
// GET /api/analytics/compare?player1=id&player2=id
// -----------------------------------------------
const comparePlayers = async (req, res) => {
  try {
    const { player1, player2 } = req.query;

    // Find both players
    const p1 = await Player.findById(player1);
    const p2 = await Player.findById(player2);

    if (!p1 || !p2) {
      return res.status(404).json({ message: 'One or both players not found ❌' });
    }

    // Calculate average skills for both
    const calcAvg = (skills) => {
      if (!skills) return 0;
      return Math.round((
        (skills.dribbling || 0) +
        (skills.passing   || 0) +
        (skills.tackling  || 0) +
        (skills.shooting  || 0) +
        (skills.pace      || 0) +
        (skills.stamina   || 0)
      ) / 6);
    };

    // Calculate performance stats for both
    const calcStats = (history) => {
      if (!history || history.length === 0) {
        return { totalGoals: 0, totalAssists: 0, avgRating: 0, matches: 0 };
      }
      return {
        matches:      history.length,
        totalGoals:   history.reduce((sum, m) => sum + m.goals, 0),
        totalAssists: history.reduce((sum, m) => sum + m.assists, 0),
        avgRating:    (history.reduce((sum, m) => sum + m.rating, 0) / history.length).toFixed(1),
      };
    };

    res.status(200).json({
      message: 'Players compared successfully ✅',
      player1: {
        _id:      p1._id,
        name:     p1.name,
        position: p1.position,
        age:      p1.age,
        region:   p1.region,
        club:     p1.club,
        skills:   p1.skills,
        avgSkill: calcAvg(p1.skills),
        stats:    calcStats(p1.performanceHistory),
      },
      player2: {
        _id:      p2._id,
        name:     p2.name,
        position: p2.position,
        age:      p2.age,
        region:   p2.region,
        club:     p2.club,
        skills:   p2.skills,
        avgSkill: calcAvg(p2.skills),
        stats:    calcStats(p2.performanceHistory),
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// 3.4 TALENT SEARCH & FILTERING
// Search players by age, position, region, skills
// GET /api/analytics/search
// -----------------------------------------------
const searchTalents = async (req, res) => {
  try {
    // Get filter values from query params
    const { position, region, minAge, maxAge, minSkill } = req.query;

    // Build filter object dynamically
    const filter = {};

    // Filter by position if provided
    if (position) filter.position = position;

    // Filter by region if provided
    if (region) filter.region = { $regex: region, $options: 'i' };

    // Filter by age range if provided
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      if (maxAge) filter.age.$lte = parseInt(maxAge);
    }

    // Get filtered players
    let players = await Player.find(filter)
      .populate('addedBy', 'name role');

    // Filter by minimum skill rating if provided
    if (minSkill) {
      players = players.filter(player => {
        const skills = player.skills;
        if (!skills) return false;
        const avg = (
          (skills.dribbling || 0) +
          (skills.passing   || 0) +
          (skills.tackling  || 0) +
          (skills.shooting  || 0) +
          (skills.pace      || 0) +
          (skills.stamina   || 0)
        ) / 6;
        return avg >= parseInt(minSkill);
      });
    }

    res.status(200).json({
      message: 'Talent search completed ✅',
      count:   players.length,
      players,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// 3.5 LEADERBOARDS / TOP PERFORMERS
// Shows top scorers, assist leaders etc.
// GET /api/analytics/leaderboards
// -----------------------------------------------
const getLeaderboards = async (req, res) => {
  try {
    // Get all players with performance history
    const players = await Player.find()
      .populate('addedBy', 'name role');

    // Calculate total goals and assists for each player
    const leaderboard = players.map(player => {
      const history = player.performanceHistory || [];

      const totalGoals    = history.reduce((sum, m) => sum + (m.goals   || 0), 0);
      const totalAssists  = history.reduce((sum, m) => sum + (m.assists || 0), 0);
      const totalMatches  = history.length;
      const avgRating     = totalMatches
        ? (history.reduce((sum, m) => sum + (m.rating || 0), 0) / totalMatches).toFixed(1)
        : 0;

      // Calculate clean sheets for goalkeepers
      const cleanSheets = player.position === 'GK'
        ? history.filter(m => m.saves > 0).length
        : 0;

      return {
        _id:          player._id,
        name:         player.name,
        position:     player.position,
        club:         player.club,
        region:       player.region,
        totalGoals,
        totalAssists,
        totalMatches,
        avgRating:    parseFloat(avgRating),
        cleanSheets,
      };
    });

    // Top 5 scorers
    const topScorers = [...leaderboard]
      .sort((a, b) => b.totalGoals - a.totalGoals)
      .slice(0, 5);

    // Top 5 assist leaders
    const topAssists = [...leaderboard]
      .sort((a, b) => b.totalAssists - a.totalAssists)
      .slice(0, 5);

    // Top 5 by rating
    const topRated = [...leaderboard]
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 5);

    // Top 5 clean sheets (GK only)
    const topCleanSheets = [...leaderboard]
      .filter(p => p.position === 'GK')
      .sort((a, b) => b.cleanSheets - a.cleanSheets)
      .slice(0, 5);

    res.status(200).json({
      message: 'Leaderboards fetched ✅',
      topScorers,
      topAssists,
      topRated,
      topCleanSheets,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all controllers
module.exports = {
  getPlayerRankings,
  getPerformanceTrends,
  comparePlayers,
  searchTalents,
  getLeaderboards,
};