const express = require("express");
const router = express.Router();
const teacherApi = require("./apiTeacher");

router.use(async function (req, res, next) {
  console.log("FROM API: " + req.url);
  next();
});

router.use("/teacher", teacherApi);

module.exports = router;
