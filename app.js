const express = require("express");
const app = express();

const { authStrategies } = require("./src/users");
app.use(
  express.urlencoded({
    extended: true,
  })
);

module.exports = app;
