const Connect = require("./connect");
const Connect2 = require("./connect2");

Connect.loadClass();
Connect2.loadClass();

const shared = {
  Connect,
  Connect2,
};

module.exports = shared;
