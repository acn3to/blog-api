const passport = require("passport");
const User = require("./users-model");
const { InvalidArgumentError } = require("../errors");
const allowListRefreshToken = require("../../redis/allowlist-refresh-token");

async function verifyRefreshToken(refreshToken) {
  if (!refreshToken) {
    throw new InvalidArgumentError("Refresh token not sent");
  }
  const id = await allowListRefreshToken.getValue(refreshToken);
  if (!id) {
    throw new InvalidArgumentError("Invalid refresh token!");
  }
  return id;
}

async function invalidateRefreshToken(refreshToken) {
  return allowListRefreshToken.delete(refreshToken);
}

module.exports = {
  local(req, res, next) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err && err.name === "InvalidArgumentError") {
        return res.status(401).json({ error: err.message });
      }

      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json();
      }

      req.user = user;
      return next();
    })(req, res, next);
  },

  bearer(req, res, next) {
    passport.authenticate("bearer", { session: false }, (err, user, info) => {
      if (err && err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: err.message });
      }

      if (err && err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ error: err.message, expiredAt: err.expiredAt });
      }

      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json();
      }

      req.token = info.token;
      req.user = user;
      return next();
    })(req, res, next);
  },

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const id = await verifyRefreshToken(refreshToken);
      await invalidateRefreshToken(refreshToken);
      req.user = await User.getById(id);
      return next();
    } catch (err) {
      if (err.name === "InvalidArgumentError") {
        return res.status(401).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    }
  },
};
