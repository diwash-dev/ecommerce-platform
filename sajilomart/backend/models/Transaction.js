// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema(
//   {
//     // Reference to the order
//     orderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       required: false, // Will be null during payment initiation, updated on success
//     },

//     // Reference to the user
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Payment amount in rupees
//     amount: {
//       type: Number,
//       required: true,
//     },

//     // Payment gateway used
//     payment_gateway: {
//       type: String,
//       enum: ["khalti", "esewa", "fonepay", "COD"],
//       required: true,
//     },

//     // Transaction status
//     status: {
//       type: String,
//       enum: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
//       default: "PENDING",
//     },

//     // Khalti-specific fields
//     pidx: {
//       type: String,
//       // Payment identifier from Khalti
//     },
//     khalti_transaction_id: {
//       type: String,
//       // Khalti's internal transaction ID
//     },

//     // Cart products snapshot (before order creation)
//     products: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         color: String,
//         price: Number,
//       },
//     ],

//     // Delivery address
//     address: {
//       type: String,
//       required: true,
//     },

//     // Customer phone number
//     customerPhone: {
//       type: String,
//       required: true,
//     },

//     // Payment verification data (store Khalti response)
//     verification_response: {
//       type: mongoose.Schema.Types.Mixed,
//     },

//     // Error details if payment failed
//     error_message: {
//       type: String,
//     },
//   },
//   { timestamps: true },
// );

// // Index for faster queries
// transactionSchema.index({ pidx: 1 });
// transactionSchema.index({ userId: 1, status: 1 });
// transactionSchema.index({ orderId: 1 });

// const Transaction = mongoose.model("Transaction", transactionSchema);

// module.exports = Transaction;
