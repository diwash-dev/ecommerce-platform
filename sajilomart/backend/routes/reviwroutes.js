const router = require("express").Router();
const {
  createreview,
  updatereview,
  deletereview,
  getreviews,
  replyreview,
} = require("../controllers/reviewcontroller");
const verified = require("../middleware/verifiedtoken");



router.get("/getreviews/:id", getreviews);
router.post("/replyreview/:id", verified, replyreview);

router.post("/createreview", verified, createreview);
router.put("/updatereview/:id", verified, updatereview);
router.delete("/deletereview/:id", verified, deletereview);

module.exports = router;
