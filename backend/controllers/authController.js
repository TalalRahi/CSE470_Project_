const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const registerUser = async (req, res) => {
  try {
    console.log('Register called with:', req.body);

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required ❌' });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Email exists ❌' });
    }

    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Player'
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registered ✅',
      token,
      user: { id: user._id, name, email, role: user.role }
    });

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('Login called with:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required ❌' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials ❌' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials ❌' });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful ✅',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out ✅' });
};

const changePassword = async (req, res) => {
  try {
    console.log('Change password called');

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords required ❌' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found ❌' });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password incorrect ❌' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed ✅' });

  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, logoutUser, changePassword };