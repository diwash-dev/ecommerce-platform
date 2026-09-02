const Roles = require("../utils/const");
const Product = require("../models/Products");
const fs = require("fs");
// cloudinary setup import
const cloudinary = require("../utils/cloud");

const normalizeProductName = (value = "") =>
  decodeURIComponent(String(value))
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const escapeRegExp = (value = "") =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createProduct = async (req, res) => {
  if (req.role !== Roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }
  try {
    const { name, description, price, category, stock, colors } = req.body;

    const uploadImages = [];

    if (!req.files || !req.files.length) {
      return res
        .status(400)
        .json({ message: "No images uploaded", success: false });
    }

    // Parallel upload for faster processing
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path || file.path, {
        folder: "products",
      }),
    );

    const results = await Promise.all(uploadPromises);

    results.forEach((result) => {
      uploadImages.push({
        url: result.secure_url,
        id: result.public_id,
      });
    });

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      colors,
      image: uploadImages,
    });

    await product.save();

    // Optionally: cleanup temp files (non-blocking)
    try {
      req.files.forEach((f) => {
        if (f.path) {
          fs.unlink(f.path, () => {});
        }
      });
    } catch (e) {
      // ignore cleanup errors
    }

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// update product controller
const updateProduct = async (req, res) => {
  if (req.role !== Roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }

  try {
    const { ...data } = req.body;
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", success: false });

    return res.status(200).json({
      message: "Product updated successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// delete product controller
const deleteProduct = async (req, res) => {
  if (req.role !== Roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }

  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// get product controller
const getProduct = async (req, res) => {
  try {
    let { search, page, limit, price, category } = req.query;

    // Cap pagination to prevent large data transfers
    page = Math.max(1, parseInt(page) || 1);
    limit = Math.min(50, Math.max(1, parseInt(limit) || 12)); // Max 50 items, default 12
    const skip = (page - 1) * limit;

    let query = {};

    if (category && category.toLowerCase() !== "all") {
      query.category = category.charAt(0).toUpperCase() + category.slice(1);
    }

    if (search) query.name = { $regex: search, $options: "i" };

    if (price >= 0) query.price = { $lte: price };

    // Exclude blacklisted products
    query.blacklisted = { $ne: true };

    // Use .lean() for 10x performance - skips Mongoose document instantiation
    // Use select() to only fetch needed fields
    const products = await Product.find(query)
      .select("name image rating description price reviews blacklisted")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Performance optimization

    // Transform in JavaScript (more efficient than Mongoose methods)
    const newProductsArray = products.map((product) => ({
      ...product,
      images: product.image?.[0]?.url || "",
    }));

    // get total products count for pagination
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    // if no products found
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found", success: false });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      data: newProductsArray,
      Pagination: {
        currentPage: page,
        totalProducts,
        totalPages,
        pageSize: limit,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// get product by name controller
const getProductByName = async (req, res) => {
  const { name } = req.params;

  try {
    const normalizedName = normalizeProductName(name);

    if (!normalizedName) {
      return res
        .status(400)
        .json({ message: "Invalid product name", success: false });
    }

    const strictPattern = normalizedName
      .split(" ")
      .map(escapeRegExp)
      .join("\\s+");

    let product = await Product.findOne({
      name: { $regex: `^${strictPattern}$`, $options: "i" },
    });

    if (!product) {
      const firstToken = normalizedName.split(" ")[0];
      const candidatePattern = escapeRegExp(firstToken);

      const candidates = await Product.find({
        name: { $regex: candidatePattern, $options: "i" },
      }).limit(50);

      product =
        candidates.find(
          (item) => normalizeProductName(item.name) === normalizedName,
        ) ||
        candidates.find((item) => {
          const normalizedDbName = normalizeProductName(item.name);
          return (
            normalizedDbName.includes(normalizedName) ||
            normalizedName.includes(normalizedDbName)
          );
        });
    }

    if (!product)
      return res
        .status(404)
        .json({ message: "Product not found", success: false });

    return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// blacklist product controller
const blacklistProduct = async (req, res) => {
  if (req.role !== Roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { blacklisted: true },
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: `Product ${product.name} blacklisted successfully`,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// remove from blacklist controller
const removeFromBlacklist = async (req, res) => {
  if (req.role !== Roles.admin) {
    return res.status(401).json({ message: "Access denied", success: false });
  }
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { blacklisted: false },
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    return res.status(200).json({
      message: `Product ${product.name} removed from blacklist successfully`,
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductByName,
  blacklistProduct,
  removeFromBlacklist,
};
