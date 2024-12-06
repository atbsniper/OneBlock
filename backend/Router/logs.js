const express = require("express");
const logController = require("../Controller/logController");
const router = express.Router();

router.use(express.json());

router.route("/getLogs").get(logController.getLog);

router.route("/uploadLogs").post(logController.uploadLogs);

module.exports = router;
