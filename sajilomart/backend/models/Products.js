const mongoose = require("mongoose");
const Review = require("./Review");

const productSchema = new mongoose.Schema(
  {
    // Define the fields for the Product model
    name: {
      type: String,
      required: true,
      index: true, // Index for search queries
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      index: true, // Index for price range queries
    },
    category: {
      type: String,
      required: true,
      index: true, // Index for category filtering
    },
    image: {
      type: Array,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
      index: true, // Index for sorting by rating
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    colors: {
      type: Array,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
      index: true, // Index for filtering active products
    },
  },
  { timestamps: true },
);

// Compound indexes for common query patterns
productSchema.index({ category: 1, price: 1 });
productSchema.index({ blacklisted: 1, category: 1 });
productSchema.index({ createdAt: -1 }); // For sorting newest first

// Calculate average rating based on reviews
productSchema.methods.calculateRating = async function () {
  const reviews = await Review.find({ productId: this._id });
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = totalRating / reviews.length;
  } else {
    this.rating = 5;
  }
  await this.save();
};

// Update product rating whenever a new review is added
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
