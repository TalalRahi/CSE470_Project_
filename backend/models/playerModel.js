// Import mongoose to create schema and model
const mongoose = require('mongoose');

// -----------------------------------------------
// SKILLS SCHEMA
// Requirement 1.5 - Record Key Skills
// Each skill is rated from 1 to 100
// -----------------------------------------------
const skillsSchema = new mongoose.Schema({
  dribbling: { type: Number, min: 1, max: 100, default: 50 },
  passing: { type: Number, min: 1, max: 100, default: 50 },
  tackling: { type: Number, min: 1, max: 100, default: 50 },
  shooting: { type: Number, min: 1, max: 100, default: 50 },
  pace: { type: Number, min: 1, max: 100, default: 50 },
  stamina: { type: Number, min: 1, max: 100, default: 50 },
});

// -----------------------------------------------
// PERFORMANCE HISTORY SCHEMA
// Requirement 1.6 - Player Performance History
// -----------------------------------------------
const performanceSchema = new mongoose.Schema({
  matchName: { type: String, required: true },
  matchDate: { type: Date, required: true },
  opponent: { type: String, required: true },
  minutesPlayed: { type: Number, default: 0 },
  goals: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  yellowCards: { type: Number, default: 0 },
  redCards: { type: Number, default: 0 },
  rating: { type: Number, min: 1, max: 10, default: 5 },
  notes: { type: String },
});

// -----------------------------------------------
// MAIN PLAYER SCHEMA
// -----------------------------------------------
const playerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    region: { type: String, required: true },
    club: { type: String, required: true },
    photo: { type: String, default: '' },
    height: { type: Number },
    weight: { type: Number },
    medicalHistory: { type: String, default: 'None' },
    position: {
      type: String,
      enum: ['GK', 'CB', 'FB', 'CDM', 'CM', 'CAM', 'Winger', 'ST'],
      required: true,
    },
    dominantFoot: {
      type: String,
      enum: ['Left', 'Right', 'Both'],
      required: true,
    },
    skills: { type: skillsSchema, default: () => ({}) },
    performanceHistory: [performanceSchema],
    visibility: {
      type: String,
      enum: ['Public', 'Private', 'Scouts Only'],
      default: 'Public',
    },
    achievements: [
      {
        title: { type: String },
        description: { type: String },
        earnedDate: { type: Date, default: Date.now },
        icon: { type: String, default: '🏆' },
      },
    ],
    mediaHighlights: [
      {
        title: { type: String },
        url: { type: String },
        type: { type: String, enum: ['video', 'image'], default: 'video' },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Player', playerSchema);