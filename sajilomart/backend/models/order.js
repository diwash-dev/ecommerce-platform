const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Define the schema for the Order model
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
    },
    customerPhone: {
      type: String,
    },

    // Payment method selected by user: COD, Khalti, eSewa, Fonepay
    paymentMethod: {
      type: String,
      enum: ["COD", "khalti", "esewa", "fonepay"],
      default: "COD",
    },

    // Khalti-specific fields
    khaltiPaymentId: {
      type: String,
      // Unique token returned by Khalti widget on successful payment
    },
    khaltiSignature: {
      type: String,
      // Optional, mostly for future use if needed by backend for verification
    },
    khaltiOrderId: {
      type: String,
      // Optional, frontend order identifier for Khalti payment
    },

    khaltiamount: {
      type: Number,
      // Amount paid in paisa (Khalti requires paisa)
    },
    khaldireferenceId: {
      type: String,
      // Verification reference returned by Khalti after success
    },
    khaltiStatus: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      // Current payment status of the order
    },

    // Razorpay payment details
    /*razorpayPaymentId: {
      type: String,
      required: true,
    },
    razorpaysignature: {
      type: String,
      required: true,
    },
    razorpayorderId: {
      type: String,
      required: true,
    },
    */

    products: [
      // Define the schema for the products array, which contains objects with product details
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      // Define the allowed values for the status field
      enum: [
        "pending",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "completed",
      ],
      default: "pending",
      index: true, // Index for status filtering
    },
  },
  { timestamps: true },
);

// Compound indexes for common query patterns
orderSchema.index({ userId: 1, createdAt: -1 }); // User's orders sorted by date
orderSchema.index({ status: 1, createdAt: -1 }); // Orders by status
orderSchema.index({ createdAt: -1 }); // For date range queries

// Create the Order model using the orderSchema
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
