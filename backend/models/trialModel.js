// Import mongoose to create schema and model
const mongoose = require('mongoose');

// -----------------------------------------------
// TRIAL MODEL
// Requirement 4.2 - Trial/Camp Application System
// Players apply for trials/camps
// -----------------------------------------------
const trialSchema = new mongoose.Schema(
  {
    // ---- TRIAL INFO ----

    // Name of the trial or camp
    // e.g. "National Youth Trial 2026"
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Description of the trial
    description: {
      type: String,
      required: true,
    },

    // Location of the trial
    location: {
      type: String,
      required: true,
    },

    // Date of the trial
    trialDate: {
      type: Date,
      required: true,
    },

    // Who created this trial (Coach or Admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ---- APPLICATIONS ----
    // List of players who applied for this trial
    applications: [
      {
        // The player who applied
        player: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Player',
        },

        // The user account of the player
        appliedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },

        // Status of the application
        // Pending = waiting for coach review
        // Accepted = coach accepted the player
        // Rejected = coach rejected the player
        status: {
          type: String,
          enum: ['Pending', 'Accepted', 'Rejected'],
          default: 'Pending',
        },

        // Date the player applied
        appliedAt: {
          type: Date,
          default: Date.now,
        },

        // Coach notes about this application
        notes: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    // Automatically adds createdAt and updatedAt
    timestamps: true,
  }
);

// Create and export the Trial model
module.exports = mongoose.model('Trial', trialSchema);