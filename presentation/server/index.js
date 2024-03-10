const express = require("express");
const path = require("path");
const app = express();

const { PORT = 5000 } = process.env;

const dist = path.join(__dirname, "dist");

// allow serving of UI for CSR variant
app.use(express.static(dist));

app.get("*", function (req, res) {
  res.sendFile(path.join(dist, "index.html"));
});

const bootServer = async () => {
  return app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
};

// Go
const server = bootServer();
