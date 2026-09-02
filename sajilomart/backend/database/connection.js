const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      // Connection pool settings - improves concurrent request handling
      maxPoolSize: 50, // Up from default 10
      minPoolSize: 10, // Maintain warm connections

      // Timeouts
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // Retry settings
      retryWrites: true,
      retryReads: true,
    });

    if (connection.connection.readyState === 1) {
      console.log(`connected to MongoDB at ${connection.connection.host}`);
    }

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting reconnect...");
    });
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
module.exports = { connectDB };
