const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;
const bcrypt = require("bcrypt");
const User = require("./users-model");
const { InvalidArgumentError } = require("../errors");
const tokens = require("./tokens");

function verifyUser(user) {
  if (!user) {
    throw new InvalidArgumentError("No user attached to this email");
  }
}

async function verifyPassword(password, hashPassword) {
  const validPassword = await bcrypt.compare(password, hashPassword);
  if (!validPassword) {
    throw new InvalidArgumentError("Invalid password or email!");
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
      const id = await tokens.access.verify(token);
      const user = await User.getById(id);
      done(null, user, { token });
    } catch (err) {
      done(err);
    }
  })
);
