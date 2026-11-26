// routes/dataRoutes.js
const express = require("express");
const dataController = require("../controllers/dataController");
const router = express.Router();

router.post("/getCategoriesMaster", dataController.getCategoriesMaster)

module.exports = router;