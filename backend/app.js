// sets up the Express application, routes for backend server
const express = require("express");
const logs = require("./Router/logs");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/LogGard", logs);

module.exports = app;
