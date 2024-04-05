const express = require("express");
const router = express.Router();

const index = require("./hello.controller");
const limit = require("../../config/rateLimiter");

router.route("/").get(index.helloIndex);
router.route("/hello").get(limit(10), index.test);

module.exports = router;
