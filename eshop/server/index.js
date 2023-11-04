const express = require('express')
const configureAPI = require('./configure')
const app = express()

const { PORT = 5000 } = process.env;

const dist = __dirname + 'dist';

// API
configureAPI(app);

// allow serving of UI for CSR variant
app.use(express.static(dist));

// allow serving of product pictures
app.use("/public/products", express.static('uploads/products'));

app.get('/', function (req, res) {
  res.sendFile(dist + "index.html");
});

// Go
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
})