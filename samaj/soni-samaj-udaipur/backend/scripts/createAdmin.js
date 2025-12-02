require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      email: process.env.ADMIN_EMAIL 
    });

    if (existingAdmin) {
      console.log('Admin already exists with email:', process.env.ADMIN_EMAIL);
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'super_admin'
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email:', process.env.ADMIN_EMAIL);
    console.log('Please change the password after first login.');

  } catch (error) {
    console.error('Error creating admin:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();