const router = require("express").Router();
const verifyToken = require("../middleware/verifiedtoken");
const {
  changeUsername,
  changePassword,
} = require("../controllers/setcontroller");

router.put("/change-username", verifyToken, changeUsername);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;
