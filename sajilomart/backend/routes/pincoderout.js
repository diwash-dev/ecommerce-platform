const verifyToken = require("../middleware/verifiedtoken");
const { addpincode, getpincode } = require("../controllers/pincodecontrol");
const router = require("express").Router();

router.post("/addpincode", verifyToken, addpincode);

router.get("/getpincode/:pincode", getpincode);

module.exports = router;
