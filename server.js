const app = require("./src/app");
const { connect } = require("./src/db/mongoose");
const { env } = require("./src/config/env");
connect();
module.exports = app;
