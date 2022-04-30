const redis = require("redis");
const blocklist = redis.createClient({ prefix: "blocklist-access-token: " });
const manipulateList = require("./manipulate-list");
const manipulateBlocklist = manipulateList(blocklist);

const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");

function generateHashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

module.exports = {
  async add(token) {
    const expireDate = jwt.decode(token).exp;
    const hashToken = generateHashToken(token);
    await manipulateBlocklist.add(hashToken, "", expireDate);
  },
  async hasToken(token) {
    const hashToken = generateHashToken(token);
    return manipulateBlocklist.hasKey(hashToken);
  },
};
