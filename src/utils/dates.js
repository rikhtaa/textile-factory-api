function toUtcDateOnly(yyyyMmDd) {
const [y, m, d] = yyyyMmDd.split("-").map((v) => parseInt(v, 10));
return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
}
function addDays(date, days) {
const nd = new Date(date);
nd.setUTCDate(nd.getUTCDate() + days);
return nd;
}
module.exports = { toUtcDateOnly, addDays };