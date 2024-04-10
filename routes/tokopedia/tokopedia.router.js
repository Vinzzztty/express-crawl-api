const express = require("express");
const router = express.Router();
const compression = require("compression");

// Controller
const tokped = require("./tokopedia.controller");

// Routes
router.route("/").get(tokped.indexTokped);
router.route("/").post(tokped.crawlTokped);

module.exports = router;
