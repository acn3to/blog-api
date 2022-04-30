const blocklist = require("./blocklist");

const { promisify } = require("util");
const existsAsync = promisify(blocklist.exists).bind(blocklist);
const setAsync = promisify(blocklist.set).bind(blocklist);

const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");

function generateHashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

module.exports = {
  async add(token) {
    const expireDate = jwt.decode(token).exp;
    const hashToken = generateHashToken(token);
    await setAsync(hashToken, "");
    await blocklist.expireat(hashToken, expireDate);
  },
  async hasToken(token) {
    const hashToken = generateHashToken(token);
    const result = await existsAsync(hashToken);
    return result === 1;
  },
};
