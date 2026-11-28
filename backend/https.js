// const express = require("express");
// const path = require("path");
// const fs = require("fs");
// const cors = require("cors");
// const https = require("https");
// const http = require("http"); // Import HTTP module
// const dataRoutes = require("./routes/dataRoutes");
// const app = express();


// const HTTPS_PORT = 5508; // HTTPS server port

// // SSL options for HTTPS
// const sslOptions = {
//   key: fs.readFileSync(path.resolve("C:/Utils/STAR.yjktechnologies.com_cert_Nov2026", "STAR.yjktechnologies.com_key.key")),
//   cert: fs.readFileSync(path.resolve("C:/Utils/STAR.yjktechnologies.com_cert_Nov2026", "STAR.yjktechnologies.com.crt")),
//   ca: fs.readFileSync(path.resolve("C:/Utils/STAR.yjktechnologies.com_cert_Nov2026", "STAR.yjktechnologies.com.ca-bundle")),
// };

// app.use(cors( {limit:'50mb'} ));
// app.use(express.json({limit:'50mb'}));

// // Middleware
// app.use("/", dataRoutes);

// app.get("/", (req, res) => {
//     res.send("Welcome to the home page!");
// });

// // Create HTTPS server
// https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
//     console.log(`HTTPS server running on https://localhost:${HTTPS_PORT}`);
//   });

// https.js (Production HTTPS)
require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const https = require("https");
const dataRoutes = require("./routes/dataRoutes");
const { applySecurityAndParsers } = require("./config/securityConfig");

const app = express();
const HTTPS_PORT = Number(process.env.PORT);
const bodyLimit = process.env.JSON_BODY_LIMIT;

applySecurityAndParsers(app, bodyLimit);

const certDir = process.env.SSL_CERT_DIR;
const keyFile = process.env.SSL_KEY_FILE;
const crtFile = process.env.SSL_CRT_FILE;
const caFile = process.env.SSL_CA_FILE;

const sslOptions = {
  key: fs.readFileSync(path.resolve(certDir, keyFile)),
  cert: fs.readFileSync(path.resolve(certDir, crtFile)),
  ca: fs.readFileSync(path.resolve(certDir, caFile)),
};

app.use("/", dataRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the home page!");
});

https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running on port ${HTTPS_PORT}`);
});