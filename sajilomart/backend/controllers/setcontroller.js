const Roles = require("../utils/const");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const admin = require("../models/Admin");

// @desc    Change username for admin
const changeUsername = async (req, res) => {
  if (req.role !== Roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }

  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: "required fields are missing", success: false });
    }

    const { newUsername } = req.body;
    // Validate input
    if (!newUsername) {
      return res
        .status(400)
        .json({ message: "New username is required", success: false });
    }

    // Check if new username already exists
    const existingUser = await admin.findOne({ username: newUsername });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username already exists", success: false });
    }

    // Update the username in the database using the authenticated user's ID
    const user = await admin.findByIdAndUpdate(
      req.id,
      {
        username: newUsername,
      },
      { new: true },
    );

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    // Return success response
    return res.status(200).json({
      message: `Username updated to ${user.username}`,
      success: true,
      user: {
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Change password controller
const changePassword = async (req, res) => {
  if (req.role !== Roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }
  // Validate input
  try {
    const { username, newPassword, previousPassword } = req.body;
    if (!previousPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    let user = await admin.findOne({ username });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const isPasswordMatch = await bcrypt.compare(
      previousPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Previous password is incorrect", success: false });
    }

    // Hash the new password and update it in the database
    const securedPassword = await bcrypt.hash(newPassword, 10);
    user.password = securedPassword;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  changeUsername,
  changePassword,
};
