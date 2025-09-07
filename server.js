const app = require("./src/app");
const { connect } = require("./src/db/mongoose");
const { env } = require("./src/config/env");
(async () => {
await connect();
  app.get("/",(req, res)=>{ res.send("hi")})
app.listen(env.PORT, () => {
console.log(`API listening on http://localhost:${env.PORT}`);
});
})();
