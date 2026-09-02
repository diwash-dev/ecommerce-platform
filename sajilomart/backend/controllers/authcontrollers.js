const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    let user = await User.findOne({
      email,
    });

    if (user)
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });

    //   Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }
    //
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Token expires in 7 days
      },
    );

    // Set secure httpOnly cookie in production
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin signup controller (similar to user signup but with role set to 'admin')
const adminSignup = async (req, res) => {
  const { username, password } = req.body;
  try {
    let admin = await Admin.findOne({
      username,
    });

    if (admin)
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this username",
      });

    // admin signup logic with password hashing
    const securedPassword = await bcrypt.hash(password, 10);
    admin = new Admin({
      username,
      password: securedPassword,
    });
    await admin.save();

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin login controller (similar to user login but checks for admin role)

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    let admin = await Admin.findOne({
      username,
    });
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found with this username",
      });
    }

    //   Compare the provided password with the hashed password in the database
    const comparePassword = await bcrypt.compare(password, admin.password);
    if (!comparePassword)
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // Token expires in 1 day
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

// Send OTP to email for password reset
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"SajiloMart" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your SajiloMart Password Reset OTP",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:16px">
          <h2 style="color:#f97316;margin-bottom:8px">🔑 Password Reset OTP</h2>
          <p style="color:#374151">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#374151">Use the OTP below to reset your SajiloMart password. It is valid for <strong>10 minutes</strong>.</p>
          <div style="text-align:center;margin:32px 0">
            <span style="font-size:40px;font-weight:bold;letter-spacing:12px;color:#f97316">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:13px">If you did not request a password reset, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
          <p style="color:#9ca3af;font-size:12px">SajiloMart &mdash; Your trusted ecommerce store</p>
        </div>
      `,
    });

    return res
      .status(200)
      .json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify OTP only (before showing password reset form)
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });
    }
    if (Number(otp) !== user.otp || user.otp === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Reset password after OTP verified
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No account found with this email" });
    }
    if (Number(otp) !== user.otp || user.otp === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = 0;
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  signup,
  login,
  adminSignup,
  adminLogin,
  sendOtp,
  verifyOtp,
  resetPassword,
};
