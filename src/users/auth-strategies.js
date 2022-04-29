const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklist = require("../../redis/manipulate-blacklist");

const User = require("./users-model");
const { InvalidArgumentError } = require("../errors");

function verifyUser(user) {
  if (!user) {
    throw new InvalidArgumentError("No user attached to this email address");
  }
}

async function verifyPassword(password, hashPassword) {
  const validPassword = await bcrypt.compare(password, hashPassword);
  if (!validPassword) {
    throw new InvalidArgumentError("Email or password invalid");
  }
}

async function verifyTokenInBlacklist(token) {
  const tokenInBlacklist = await blacklist.hasToken(token);
  if (tokenInBlacklist) {
    throw new jwt.JsonWebTokenError("Invalid token by logout!");
  }
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.getByEmail(email);
        verifyUser(user);
        await verifyPassword(password, user.hashPassword);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      await verifyTokenInBlacklist(token);
      const payload = jwt.verify(token, process.env.JWT_TOKEN);
      const user = await User.getById(payload.id);
      done(null, user, { token: token });
    } catch (err) {
      done(err);
    }
  })
);
