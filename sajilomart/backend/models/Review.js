const mongoose = require("mongoose");

const replyschema = new mongoose.Schema(
  {
    // Define the fields for the Reply model
    review: {
      type: String,
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    replies: [replyschema],
  },
  { timestamps: true },
);
// Create the Review model using the reviewSchema
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
