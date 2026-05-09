// This script creates the Admin account
// Run it ONCE to create the admin in database
// Admin email: admin@gmail.com
// Admin password: admin1234

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Import User model
const User = require('../models/userModel');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected ✅');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Admin already exists! ✅');
      process.exit(0);
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin1234', salt);

    // Create the admin user
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'Admin',
    });

    console.log('Admin created successfully! ✅');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin1234');
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();