const PincodeModel = require("../models/pincode");
const Roles = require("../utils/const");

const addpincode = async (req, res) => {
  // Check if the user is an admin
  if (req.role !== Roles.admin) {
    return res
      .status(401)
      .json({ message: " you are not Authorized", success: false });
  }

  const { pincode } = req.body;

  if (!pincode || pincode.length === 0) {
    return res
      .status(400)
      .json({ message: "Pincode is required", success: false });
  }
  try {
    const existingPincode = await PincodeModel.find({
      pincode: { $in: pincode.map((p) => p.pincode) },
    });
    const existingPincodeValue = existingPincode.map((p) => p.pincode);

    const newPincode = pincode.filter(
      (p) => !existingPincodeValue.includes(p.pincode),
    );

    if (newPincode.length === 0) {
      return res
        .status(400)
        .json({ message: "All pincodes already exist", success: false });
    }

    await PincodeModel.insertMany(newPincode);

    return res
      .status(200)
      .json({ message: "Pincodes added successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Get pincode availability
const getpincode = async (req, res) => {
  const { pincode } = req.params;

  try {
    const existingPincode = await PincodeModel.find({ pincode });

    if (existingPincode.length === 0) {
      return res.status(404).json({ message: "not available", success: false });
    }

    return res.status(200).json({ message: "available", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { addpincode, getpincode };
