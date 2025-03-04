const express = require("express");
const logs = require("./Router/logs");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Default route for testing
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use("/LogGard", logs);

module.exports = app;
