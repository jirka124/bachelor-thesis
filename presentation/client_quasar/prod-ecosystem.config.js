let myEnv = {};
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");

myEnv = dotenv.config({
  path: `.env`,
});
dotenvExpand.expand(myEnv);

module.exports = {
  apps: [
    {
      name: "client_quasar",
      script: "index.js",
      watch: ["./"],
      watch_delay: 1000,
      ignore_watch: ["node_modules", "hybrid_render"],
      wait_ready: true,
      shutdown_with_message: true,
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
