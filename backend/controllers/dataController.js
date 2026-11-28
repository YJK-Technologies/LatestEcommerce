// // controllers/dataController.js
// const sql = require("mssql");
// const connection = require("../connection/connection");
// const dbConfig = require("../config/dbConfig");


// const getCategoriesMaster = async (req, res) => {
//   const { company_code } = req.body;

//   try {
//     const pool = await connection.connectToDatabase();
//     const result = await pool
//       .request()
//       .input("mode", sql.NVarChar, "ICF")
//       .input("company_code", sql.NVarChar, company_code)
//       .query(`EXEC sp_Item_Category_Master @mode,'','','','   ','','','',0,0,0,0,'','','','','',@company_code,'','','',''`);
//     if (result.recordset.length > 0) {
//       res.status(200).json(result.recordset);
//     } else {
//       res.status(404).json("Data not found");
//     }
//   } catch (err) {
//     console.error("Error", err);
//     res.status(500).json({ message: err.message || 'Internal Server Error' });
//   }
// };

// const loginWithEmail = async (req, res) => {
//   const { email_id, user_password } = req.body;

//   try {
//     const pool = await connection.connectToDatabase();
//     const result = await pool
//       .request()
//       .input("mode", sql.NVarChar, "ELUC")
//       .input("user_password", sql.NVarChar, user_password)
//       .input("email_id", sql.NVarChar, email_id)
//       .query("EXEC sp_user_info_hdr_Pavun @mode,'','','','','',@user_password,'','','',@email_id,'','','','','','','','','','','','','','',''");
//     const userRow = result.recordset?.[0];
//     return res.status(200).json({
//       success: true,
//       user: userRow,
//     });

//   } catch (err) {
//     console.error("Error", err);
//     res.status(500).json({ message: err.message || 'Internal Server Error' });
//   }
// };

// module.exports = {
//   getCategoriesMaster,
//   loginWithEmail
// };

const sql = require("mssql");
const jwt = require("jsonwebtoken");
const connection = require("../connection/connection");
const { getRefreshCookieOptions } = require("../config/securityConfig");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

function resolveAppRole(userRow) {
  const roleStr = String(userRow.role_id ?? "").trim().toLowerCase();
  const isSuperAdmin = String(userRow.super_admin ?? "").trim().toLowerCase() === "yes";
  if (isSuperAdmin || roleStr === "ad" || roleStr === "admin" || roleStr === "1") {
    return "admin";
  }
  return "customer";
}

function issueTokens(res, payload) {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  res.cookie("aura_refresh_token", refreshToken, getRefreshCookieOptions());
  return { accessToken, refreshToken };
}

const getCategoriesMaster = async (req, res) => {
  const { company_code } = req.body;

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "ICF")
      .input("company_code", sql.NVarChar, company_code)
      .query(`EXEC sp_Item_Category_Master @mode,'','','','   ','','','',0,0,0,0,'','','','','',@company_code,'','','',''`);

    if (result.recordset.length > 0) {
      return res.status(200).json(result.recordset);
    }
    return res.status(404).json({ message: "Data not found" });
  } catch (err) {
    console.error("getCategoriesMaster Error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const loginWithEmail = async (req, res) => {
  const { email_id, user_password } = req.body;

  if (!email_id || !user_password) {
    return res.status(400).json({
      success: false,
      message: "Email ID and password are required",
    });
  }

  try {
    const pool = await connection.connectToDatabase();
    const result = await pool
      .request()
      .input("mode", sql.NVarChar, "ELUC")
      .input("user_password", sql.NVarChar, user_password)
      .input("email_id", sql.NVarChar, email_id)
      .query("EXEC sp_user_info_hdr @mode,'','','','','',@user_password,'','','',@email_id,'','','','','','','','','','','','','','',''");

    const userRow = result.recordset?.[0];
    if (!userRow) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email ID or Password",
      });
    }

    const payload = {
      user_code: String(userRow.user_code || "").trim(),
      email_id: String(userRow.email_id || email_id).trim(),
      company_code: String(userRow.company_code || "").trim(),
      role: resolveAppRole(userRow),
    };

    const { accessToken, refreshToken } = issueTokens(res, payload);

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: userRow,
    });
  } catch (err) {
    console.error("loginWithEmail Error:", err);
    const msg = err?.originalError?.info?.message || err.message || "Internal Server Error";
    const isAuthErr = /invalid|closed|inactive|required/i.test(msg);
    return res.status(isAuthErr ? 401 : 500).json({
      success: false,
      message: msg,
    });
  }
};

const refreshTokenHandler = async (req, res) => {
  const token = req.cookies?.aura_refresh_token || req.body?.refreshToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "Refresh token missing" });
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const payload = {
      user_code: decoded.user_code,
      email_id: decoded.email_id,
      company_code: decoded.company_code,
      role: decoded.role,
    };
    const tokens = issueTokens(res, payload);
    return res.status(200).json({ success: true, ...tokens, expiresIn: 900 });
  } catch {
    res.clearCookie("aura_refresh_token", { path: "/" });
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("aura_refresh_token", { path: "/" });
  return res.status(200).json({ success: true, message: "Logged out" });
};

module.exports = {
  getCategoriesMaster,
  loginWithEmail,
  refreshTokenHandler,
  logoutUser,
};