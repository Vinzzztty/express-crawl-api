const express = require("express");
const router = express.Router();
const compression = require("compression");

// Controller
const twitter = require("./twitter.controller");

// Routes
router.route("/").get(twitter.indexTwitter);
router.route("/").post(twitter.crawlTwitter);
module.exports = router;
