//server.js
const express = require("express");
const cors = require("cors");
const dataRoutes = require("./routes/dataRoutes");
const app = express();
const PORT = 5401;

app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({ limit: "10mb", extended: true })); 

app.use("/", dataRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});