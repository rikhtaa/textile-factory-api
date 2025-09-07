require("dotenv").config();
const env = {
PORT: parseInt(process.env.PORT || "4000", 10),
NODE_ENV: process.env.NODE_ENV || "development",
MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/textile_factory",
JWT_SECRET: process.env.JWT_SECRET || "change-me",
JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
};
module.exports = { env };