const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

function parseAllowedOrigins() {
  return (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

function applySecurityAndParsers(app, bodyLimit) {
  const allowedOrigins = parseAllowedOrigins();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(cookieParser());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS origin not allowed: ${origin}`), false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Request-Id",
        "X-Client-App",
        "X-Client-Platform",
        "X-Idempotency-Key",
      ],
    })
  );

  app.use(express.json({ limit: bodyLimit }));
  app.use(express.urlencoded({ limit: bodyLimit, extended: true }));
}

function getRefreshCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  const isCrossSite = process.env.COOKIE_CROSS_SITE === "true";

  return {
    httpOnly: true,
    secure: isProd || isCrossSite,
    sameSite: isCrossSite ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

module.exports = {
  applySecurityAndParsers,
  getRefreshCookieOptions,
};