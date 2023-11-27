const express = require("express");
const Connect = require("./server_modules/connect");
const Connect2 = require("./server_modules/connect2");
const configureAPI = require("./configure");
const app = express();
const { Odai } = require("./server_modules/odai/odai");
const { OdaiTable } = require("./server_modules/odai/table");

const { PORT = 5000 } = process.env;

const dist = __dirname + "dist";

// API
configureAPI(app);

// allow serving of UI for CSR variant
app.use(express.static(dist));

// allow serving of product pictures
app.use("/public/products", express.static("uploads/products"));

app.get("/", function (req, res) {
  res.sendFile(dist + "index.html");
});

const bootServer = async () => {
  await Connect.loadClass();
  await Connect2.loadClass();
  await Odai.loadClass();
  await OdaiTable.loadClass();

  return app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
};

// Go
const server = bootServer();
