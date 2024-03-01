let myEnv = {};
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

myEnv = dotenv.config({
  path: `.env`,
});

module.exports = {
  apps: [
    {
      name: "client_quasar",
      script: "index.mjs",
      watch: ["./"],
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
      wait_ready: true,
      shutdown_with_message: true,
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
