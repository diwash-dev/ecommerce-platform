// import express from 'express';

const express = require("express");

// initialize express app

const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Get port number from environment variables or use 3000 as default
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const { readdirSync } = require("fs");
const { connectDB } = require("./database/connection");

// Security middleware
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const xss = require("xss-clean");

// Configured CORS: only allows requests coming from CLIENT_URL
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Basic security hardening
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

// Rate limiter (basic) - adjust window and max for production
const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(apiLimiter);

// Ensure upload tmp directory exists
const fs = require("fs");
const path = require("path");
const tmpDir = path.join(__dirname, "..", "tmp", "uploads");
fs.mkdirSync(tmpDir, { recursive: true });

connectDB();

// get, post, put, delete
app.get("/", (req, res) => {
  res.send(`<h1>server running</h1>`);
});

// dynamically load all route files from the 'routes' directory
readdirSync("./routes").map((route) =>
  // mount each route on the '/api' path, so all routes will be prefixed with '/api'
  app.use("/api", require(`./routes/${route}`)),
);

// Start server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
