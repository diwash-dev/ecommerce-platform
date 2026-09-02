const router = require("express").Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductByName,
  blacklistProduct,
  removeFromBlacklist,
} = require("../controllers/productcontroller");
const verifyToken = require("../middleware/verifiedtoken");
const upload = require("../middleware/multer");

router.post(
  "/create-product",
  verifyToken,
  upload.array("images", 5),
  createProduct,
);
// update product controller
router.put("/update-product/:id", verifyToken, updateProduct);
router.delete("/delete-product/:id", verifyToken, deleteProduct);

// get product controller
router.put("/remove-from-blacklist/:id", verifyToken, removeFromBlacklist);
router.put("/blacklist-product/:id", verifyToken, blacklistProduct);
router.get("/get-product", getProduct);
router.get("/get-product-by-name/:name", getProductByName);

module.exports = router;
