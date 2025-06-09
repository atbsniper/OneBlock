const express = require("express");
const logController = require("../Controller/logController");
const router = express.Router();

router.use(express.json());

// Handle preflight OPTIONS requests
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

router.route("/getLogs").get(logController.getLog);

router.route("/uploadLogs").post(logController.uploadLogs);

module.exports = router;
