const express = require("express");
const app = express();

const { authStrategies } = require("./src/users");

app.use(express.json());

module.exports = app;
