const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    jerseyNumber: Number,
    position: String
  }],
  region: String,
  founded: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Team', teamSchema);