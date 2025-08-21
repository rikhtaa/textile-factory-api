const express = require("express");
const routes = require("./routes");
const app = express();

app.use(express.json({ limit: "2mb" }));
app.use("/api", routes);

module.exports = app;
