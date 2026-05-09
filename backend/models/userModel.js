const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Coach', 'Player'], default: 'Player' }
}, { timestamps: true });

userSchema.methods.matchPassword = async function(pwd) {
  return await bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model('User', userSchema);