const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");

envVars = dotenv.config({
  path: envPath,
});
dotenvExpand.expand(envVars);

process.env = { ...process.env, ...envVars };

require("./index.js");
