require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/user");

async function createAdmin() {
  try {
    // Connect MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB Atlas");

    // Admin credentials
    const email = "admin-test@yopmail.com";
    const rawPassword = "pass@123";

    // Check existing admin
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create admin user
    const admin = new User({
      name: "Admin",
      phone: "1234567898",
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    // Save in database
    await admin.save();

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", rawPassword);
  } catch (err) {
    console.error("Error during admin creation:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
    process.exit(0);
  }
}

createAdmin();