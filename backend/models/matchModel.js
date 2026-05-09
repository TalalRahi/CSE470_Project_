// Import mongoose to create schema and model
// Requirement 2: Match & Tournament Tracking module
const mongoose = require('mongoose');

// -----------------------------------------------
// PLAYER MATCH STATS SCHEMA
// Requirement 2.4 - Per-player stats in a match
// -----------------------------------------------
const playerStatSchema = new mongoose.Schema({

  // Reference to the Player document
  // Links stats to a specific player
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },

  // Jersey number in this match
  jerseyNumber: { type: Number },

  // Minutes the player was on the field
  minutesPlayed: { type: Number, default: 0 },

  // Goals scored by this player
  goals: { type: Number, default: 0 },

  // Assists made by this player
  assists: { type: Number, default: 0 },

  // Yellow cards received
  yellowCards: { type: Number, default: 0 },

  // Red cards received
  redCards: { type: Number, default: 0 },

  // Saves made (for goalkeepers)
  saves: { type: Number, default: 0 },

  // Overall match rating (1-10)
  rating: { type: Number, min: 1, max: 10, default: 5 },

  // Extra notes about this player's performance
  notes: { type: String, default: '' },
});

// -----------------------------------------------
// TEAM SCHEMA
// Requirement 2.2 - Team + Squad List
// Each match has two teams (home and away)
// -----------------------------------------------
const teamSchema = new mongoose.Schema({

  // Name of the team
  // e.g. "Dhaka FC Academy"
  name: { type: String, required: true },

  // Formation used by this team
  // Requirement 2.3 - Formation
  // e.g. "4-3-3", "4-4-2"
  formation: { type: String, default: '4-3-3' },

  // Goals scored by this team in the match
  goalsScored: { type: Number, default: 0 },

  // Squad list with per-player stats
  // Requirement 2.2 + 2.4
  squad: [playerStatSchema],
});

// -----------------------------------------------
// MAIN MATCH SCHEMA
// Requirement 2.1 - Tournament/League/Friendly
// Requirement 2.3 - Match Details
// Requirement 2.5 - Result + Standings
// -----------------------------------------------
const matchSchema = new mongoose.Schema(
  {
    // ---- MATCH TYPE (Requirement 2.1) ----

    // Type of competition
    matchType: {
      type: String,
      enum: ['Tournament', 'League', 'Friendly'],
      required: true,
    },

    // Name of the tournament or league
    // e.g. "Dhaka Youth League 2026"
    competitionName: {
      type: String,
      required: true,
      trim: true,
    },

    // Round or stage
    // e.g. "Quarter Final", "Group Stage", "Week 3"
    round: {
      type: String,
      default: '',
    },

    // ---- MATCH DETAILS (Requirement 2.3) ----

    // Date the match was played
    matchDate: {
      type: Date,
      required: true,
    },

    // Venue/stadium where match was played
    venue: {
      type: String,
      required: true,
    },

    // ---- TEAMS (Requirement 2.2) ----

    // Home team with their squad
    homeTeam: {
      type: teamSchema,
      required: true,
    },

    // Away team with their squad
    awayTeam: {
      type: teamSchema,
      required: true,
    },

    // ---- RESULT (Requirement 2.5) ----

    // Match status
    status: {
      type: String,
      enum: ['Scheduled', 'Ongoing', 'Completed'],
      default: 'Scheduled',
    },

    // Winner of the match
    // null means draw or not played yet
    winner: {
      type: String,
      enum: ['Home', 'Away', 'Draw', null],
      default: null,
    },

    // Extra notes about the match
    notes: {
      type: String,
      default: '',
    },

    // Who created this match record
    // References the User (Coach or Admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create and export the Match model
module.exports = mongoose.model('Match', matchSchema);