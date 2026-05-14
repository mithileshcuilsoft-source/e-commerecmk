require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const user = require("./models/user");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- Connected to MongoDB ---");

    const email = "admin-test@yopmail.com";
    const rawPassword = "Pass@123";

    const existingAdmin = await user.findOne({ email });
    if (existingAdmin) {
      console.log("Admin user already exists. Skipping creation.");
      process.exit(0);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(rawPassword, saltRounds);

    const admin = new user({
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log(`Successfully created admin: ${email}`);
  } catch (err) {
    console.error("Error during admin creation:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
