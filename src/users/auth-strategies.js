const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

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
