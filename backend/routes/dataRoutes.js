// routes/dataRoutes.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const dataController = require("../controllers/dataController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

router.post("/loginWithEmail", loginLimiter, dataController.loginWithEmail);
router.post("/refreshToken", dataController.refreshTokenHandler);
router.post("/logoutUser", dataController.logoutUser);
router.post("/getCategoriesMaster", dataController.getCategoriesMaster);

// Attach verifyToken / requireRole("admin") on future protected endpoints:
// router.post("/exampleProtected", verifyToken, requireRole("admin"), handler);

module.exports = router;