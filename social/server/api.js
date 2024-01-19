const express = require("express");
const router = express.Router();
const apiUser = require("./apiUser");
const adminApi = require("./apiAdmin");

router.use(async function (req, res, next) {
  console.log("FROM API: " + req.url);
  next();
});

router.use("/user", apiUser);
router.use("/admin", adminApi);

module.exports = router;
