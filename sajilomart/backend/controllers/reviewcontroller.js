const roles = require("../utils/const");
const Review = require("../models/Review");
const Product = require("../models/Products");
// create review
const createreview = async (req, res) => {
  if (req.role !== roles.user) {
    return res.status(401).json({ message: "Access denied", success: false });
  }

  const userId = req.id;

  try {
    const { productId, rating, comment, reviewId } = req.body;
    // validate the required fields
    if (!productId || !rating || !comment) {
      return res
        .status(400)
        .json({ message: "Missing required fields", success: false });
    }

    const newReview = await Review.create({
      productId,
      userId,
      rating,
      comment,
      reviewId,
    });

    await newReview.populate("userId", "name ");

    let product = await Product.findByIdAndUpdate(productId, {
      $push: { reviews: newReview._id },
    });

    if (product) {
      await product.calculateRating();
    }

    return res.status(201).json({
      message: "thank you for your review",
      success: true,
      data: newReview,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// update review
const updatereview = async (req, res) => {
  if (req.role !== roles.user) {
    return res.status(401).json({ message: "Access denied", success: false });
  }

  try {
    const { id } = req.params;
    const { updatedreview } = req.body;

    let review = await Review.findByIdAndUpdate(
      id,
      { review: updatedreview },
      { new: true },
    );

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found", success: false });
    }

    await review.populate("userId", "name ");

    return res.status(200).json({
      message: "Review updated successfully",
      success: true,
      data: review,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// reply to review
const replyreview = async (req, res) => {
  if (req.role !== roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }
  const userId = req.id;

  const { id } = req.params;

  try {
    const { review } = req.body;

    // validate the review text
    if (!review) {
      return res
        .status(400)
        .json({ message: "Review text is required", success: false });
    }

    let foundreview = await Review.findByIdAndUpdate(
      {
        _id: id,
      },
      { $push: { replies: { review, userId } } },
      { new: true },
    )
      .populate("replies.userId", "name")
      .populate("userId", "name");

    if (!foundreview) {
      return res
        .status(404)
        .json({ message: "Review not found", success: false });
    }
    return res.status(200).json({
      message: "Reply added successfully",
      success: true,
      data: foundreview,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// delete review
const deletereview = async (req, res) => {
  if (req.role !== roles.user) {
    return res.status(401).json({ message: "Access denied", success: false });
  }

  try {
    const { id } = req.params;

    let review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found", success: false });
    }

    let product = await Product.findByIdAndUpdate(review.productId, {
      $pull: { reviews: review._id },
    });

    if (product) {
      await product.calculateRating();
    }

    return res.status(200).json({
      message: "Review deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// get reviews of a product
const getreviews = async (req, res) => {
  try {
    const { id } = req.params;

    let reviews = await Review.find({ productId: id })
      .populate({ path: "userId", select: "name" })
      .populate({ path: "replies.userId", select: "name" });

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this product", success: false });
    }

    return res.status(200).json({
      message: "Reviews  found successfully",
      success: true,
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  createreview,
  replyreview,
  deletereview,
  getreviews,
  updatereview,
};
