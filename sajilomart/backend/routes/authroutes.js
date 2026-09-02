const {
  signup,
  adminLogin,
  adminSignup,
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
} = require("../controllers/authcontrollers");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/adminsignup", adminSignup);
router.post("/adminlogin", adminLogin);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
