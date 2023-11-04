const express = require('express')
const router = express.Router()
const adminGeneral = require('./apiGeneral')
const adminApi = require('./apiAdmin')

router.use(function (req, res, next) {
  console.log("FROM API: " + req.url);
  next()
})

router.use("/general", adminGeneral);
router.use("/admin", adminApi);

module.exports = router