const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const options = {
  host: "localhost",
  // port: 3306,
  port: process.env.VUE_APP_MYSQL_PORT,
  user: process.env.VUE_APP_MYSQL_USER,
  password: process.env.VUE_APP_MYSQL_PASS, // 'pass123'
  database: "bachelor_forum",
};

const sessionStore = new MySQLStore(options);
sessionStore.clear(() => {});
module.exports = sessionStore;
