const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "..", "tmp", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-")
      .replace(/-+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOK = allowed.test(file.mimetype);
  const extOK = allowed.test(ext);
  if (mimeOK && extOK) cb(null, true);
  else
    cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)"), false);
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

module.exports = upload;
