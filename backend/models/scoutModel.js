// Import mongoose to create schema and model
const mongoose = require('mongoose');

// -----------------------------------------------
// SCOUT REQUEST MODEL
// Requirement 4.4 - Scout Request & Contact Workflow
// Coaches/Scouts can send requests to players
// -----------------------------------------------
const scoutSchema = new mongoose.Schema(
  {
    // The player being scouted
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },

    // The coach or scout sending the request
    scoutedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Message from the scout to the player
    message: {
      type: String,
      required: true,
    },

    // Status of the scout request
    // Pending = player hasn't responded yet
    // Accepted = player accepted
    // Rejected = player rejected
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },

    // Contact info of the scout
    contactEmail: {
      type: String,
      required: true,
    },

    // Optional phone number
    contactPhone: {
      type: String,
      default: '',
    },
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create and export the Scout model
module.exports = mongoose.model('Scout', scoutSchema);