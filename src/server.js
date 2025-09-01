const app = require("./app");
const { connect } = require("./db/mongoose");
const { env } = require("./config/env");
(async () => {
await connect();
  app.get("/",(req, res)=>{ res.send("hi")})
app.listen(env.PORT, () => {
console.log(`API listening on http://localhost:${env.PORT}`);
});
})();
