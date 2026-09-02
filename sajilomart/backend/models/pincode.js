const mongoose = require("mongoose");

const pincodeSchema = mongoose.Schema(
  {
    pincode: {
      type: String,
      required: true,
      unique: true,
    },
    area: {
      type: String,
    },
    district: {
      type: String,
    },
    state: {
      type: String,
    },
  },
  { timestamps: true },
);

const Pincode = mongoose.model("Pincode", pincodeSchema);

module.exports = Pincode;
