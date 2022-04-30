const redis = require("redis");
const manipulateList = require("./manipulate-list");
const allowlist = redis.createClient({ prefix: "allowlist-refresh-token: " });
module.exports = manipulateList(allowlist);
