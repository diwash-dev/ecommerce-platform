const crypto = require("crypto");

function generateUniqueId() {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateHmacSha256Hash(data, secret) {
  if (!data || !secret) {
    throw new Error("Data and secret are required to generate HMAC hash");
  }

  const hash = crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64");

  return hash;
}

module.exports = {
  generateUniqueId,
  generateHmacSha256Hash,
};
