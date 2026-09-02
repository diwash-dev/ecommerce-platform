const router = require("express").Router();
const {
  getordersByUserId,
  getallorders,
  getMetrics,
  updateorderstatus,
  createOrder,
} = require("../controllers/orderscontrollers");
const verified = require("../middleware/verifiedtoken");

router.get("/getordersbyuserid", verified, getordersByUserId);
router.get("/getallorders", verified, getallorders);
router.get("/getmetrics", verified, getMetrics);
router.put("/updateorderstatus/:id", verified, updateorderstatus);
router.post("/createorder", verified, createOrder);

module.exports = router;
