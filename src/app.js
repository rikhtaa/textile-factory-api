const express = require("express");
const routes = require("./routes");
const app = express();
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/error");


app.use(express.json({ limit: "2mb" }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);


module.exports = app;
