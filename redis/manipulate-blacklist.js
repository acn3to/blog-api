const blacklist = require("./blacklist");
const jwt = require("jsonwebtoken");

const { promisify } = require("util");
const existsAsync = promisify(blacklist.exists).bind(blacklist);
const setAsync = promisify(blacklist.set).bind(blacklist);

const { createHash } = require("crypto");

function generateHashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

module.exports = {
  add: async (token) => {
    const expireDate = jwt.decode(token).exp;
    const hashToken = generateHashToken(token);
    await setAsync(token, "");
    blacklist.expireat(hashToken, expireDate);
  },
  hasToken: async (token) => {
    const hashToken = generateHashToken(token);
    const result = await existsAsync(hashToken);
    return result === 1;
  },
};
