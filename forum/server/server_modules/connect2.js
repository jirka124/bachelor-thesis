const mysqlAsync = require("mysql2/promise");

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

class Connect2 {
  static async loadClass() {
    // Skip loading ODAI in preview mode
    if (Number(process.env.VUE_APP_PREVIEW)) return;

    this.connWrap = {};
    await this.startConn();
  }

  static async openConn() {
    const conn = await mysqlAsync.createConnection({
      host: "localhost",
      port: process.env.VUE_APP_MYSQL_PORT,
      user: process.env.VUE_APP_MYSQL_USER_REINV, // "root"
      password: process.env.VUE_APP_MYSQL_PASS_REINV, //"pass123",
      charset: "utf8mb4",
      timezone: "Z",
    });

    conn.on("error", async function (err) {
      console.log(err);

      Connect2.connWrap.conn = null;

      if (
        err.code === "ECONNRESET" ||
        err.code === "PROTOCOL_CONNECTION_LOST"
      ) {
        console.log("CONNECTION SHUT DOWN - waiting now");
        await delay(1000);
        console.log("CONNECTION SHUT DOWN - after wait");
        await Connect2.startConn(); // create new connection on connection being closed
      } else {
        console.error(err);
        throw new Error("THERE IS AN UNKNOWN ERROR IN MYSQL CONNECTION");
      }
    });

    return conn;
  }

  static async startConn() {
    this.connWrap.conn = null;
    this.connWrap.conn = await this.openConn();
  }
  static async endConn() {
    if (this.connWrap.conn) await this.connWrap.conn.end();
  }
}

module.exports = Connect2;
