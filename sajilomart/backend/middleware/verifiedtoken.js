const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token = null;

    // Authorization header (Bearer)
    const authHeader = req.get("authorization") || req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7).trim();
    }

    // Cookie fallback
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided", success: false });
    }

    // verify synchronously to catch exceptions
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = payload;
    req.id = payload.id;
    req.role = payload.role;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", success: false });
  }
};

module.exports = verifyToken;
