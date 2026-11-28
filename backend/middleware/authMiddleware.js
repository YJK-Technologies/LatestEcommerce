const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const verifyToken = (req, res, next) => {
  if (!ACCESS_SECRET) {
    return res.status(500).json({
      success: false,
      message: "JWT_ACCESS_SECRET is not configured",
    });
  }

  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      code: "TOKEN_MISSING",
      message: "Unauthorized: Bearer token missing",
    });
  }

  const token = authHeader.slice(7).trim();
  try {
    req.user = jwt.verify(token, ACCESS_SECRET);
    return next();
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    return res.status(401).json({
      success: false,
      code: expired ? "TOKEN_EXPIRED" : "TOKEN_INVALID",
      message: expired ? "Access token expired" : "Invalid token",
    });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      code: "FORBIDDEN_ROLE",
      message: "Forbidden: Insufficient permissions",
    });
  }
  return next();
};

module.exports = { verifyToken, requireRole };