// controllers/dataController.js
const sql = require("mssql");
const connection = require("../connection/connection");
const dbConfig = require("../config/dbConfig");
const CryptoJS = require('crypto-js');
const path = require("path");
const fs = require("fs");

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
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json("Data not found");
    }
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
};

module.exports = {
  getCategoriesMaster
};