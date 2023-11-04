module.exports = app => {
  const express = require('express')
  const cookieParser = require('cookie-parser')
  const session = require('express-session')
  const cors = require('cors')
  const sessionStore = require('./server_modules/sessionStore')
  const api = require('./api')

  const corsOptions = {
    origin: +process.env.VUE_APP_DEMO ? `http://${process.env.VUE_APP_DOMAIN_FRONT}:5173`: `https://${process.env.VUE_APP_DOMAIN_FRONT}`,
    optionsSuccessStatus: 200
  }
  
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', `Access-Control-Allow-Origin, Cache-Control, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept`)
    next();
  })
  app.options(cors())
  app.use(cors(corsOptions))
  
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  
  app.use(cookieParser())
  const cookieOptions = () => {
    if(+process.env.VUE_APP_DEMO) return { secure: false, httpOnly: false }
    return { secure: false, httpOnly: true, domain: process.env.VUE_APP_DOMAIN }
  }
  app.use(session({ // try to authenticate with cookies if Auth-Custom-Sess-Token wasnt valid
    key: process.env.VUE_APP_AUTH_SESS_KEY,
    secret: process.env.VUE_APP_AUTH_SESS_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: cookieOptions()
  }))
  app.use('/api', api)
}


