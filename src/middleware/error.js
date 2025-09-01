function notFound(_req, res) {
res.status(404).json({ message: "Not found" });
}
function errorHandler(err, _req, res, _next) {
console.error(err);
const status = err.status || 500;
res.status(status).json({ message: err.message || "Internal Server Error" });
}
module.exports = { notFound, errorHandler };
