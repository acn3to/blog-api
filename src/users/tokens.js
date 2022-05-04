const jwt = require("jsonwebtoken");
const moment = require("moment");
const crypto = require("crypto");
const allowListRefreshToken = require("../../redis/allowlist-refresh-token");
const blocklistAccessToken = require("../../redis/blocklist-access-token");
const { InvalidArgumentError } = require("../errors");

function createJwtToken(id, [timeValue, timeUnit]) {
  const payload = { id };

  const token = jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: timeValue + timeUnit,
  });
  return token;
}

async function verifyJwtToken(token, name, blocklist) {
  await verifyTokenInBlocklist(token, name, blocklist);
  const { id } = jwt.verify(token, process.env.JWT_TOKEN);
  return id;
}

async function verifyTokenInBlocklist(token, name, blocklist) {
  if (!blocklist) {
    return;
  }

  const tokenInBlocklist = await blocklist.hasToken(token);
  if (tokenInBlocklist) {
    throw new jwt.JsonWebTokenError(`${name} invalid by logout!`);
  }
}

function invalidateJwtToken(token, blocklist) {
  return blocklist.add(token);
}

async function createOpaqueToken(id, [timeValue, timeUnit], allowlist) {
  const opaqueToken = crypto.randomBytes(24).toString("hex");
  const expireDate = moment().add(timeValue, timeUnit).unix();
  await allowlist.add(opaqueToken, id, expireDate);
  return opaqueToken;
}

async function verifyOpaqueToken(token, name, allowlist) {
  verifySentToken(token, name);
  const id = await allowlist.getValue(token);
  verifyValidToken(id, name);
  return id;
}

async function invalidateOpaqueToken(token, allowlist) {
  return allowlist.delete(token);
}

function verifyValidToken(id, name) {
  if (!id) {
    throw new InvalidArgumentError(`Invalid ${name}!`);
  }
}

function verifySentToken(token, name) {
  if (!token) {
    throw new InvalidArgumentError(`${name} not sent!`);
  }
}

module.exports = {
  access: {
    name: "access token",
    list: blocklistAccessToken,
    expiration: [15, "m"],
    create(id) {
      return createJwtToken(id, this.expiration);
    },
    verify(token) {
      return verifyJwtToken(token, this.list);
    },
    invalidate(token) {
      return invalidateJwtToken(token);
    },
  },

  refresh: {
    name: "refresh token",
    list: allowListRefreshToken,
    expiration: [5, "d"],
    create(id) {
      return createOpaqueToken(id, this.expiration, this.list);
    },
    verify(token) {
      return verifyOpaqueToken(token, this.name, this.list);
    },
    invalidate(token) {
      return invalidateOpaqueToken(token, this.list);
    },
  },

  emailVerification: {
    name: "Email verification token",
    expiration: [1, "h"],
    create(id) {
      return createJwtToken(id, this.expiration);
    },
    verify(token) {
      return verifyJwtToken(token, this.name);
    },
  },
};
