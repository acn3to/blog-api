const User = require("./users-model");
const { InvalidArgumentError } = require("../errors");
const tokens = require("./tokens");
const { VerificationEmail } = require("./emails");

function createAddress(route, token) {
  const urlBase = process.env.BASE_URL;
  return `${urlBase}${route}${token}`;
}

module.exports = {
  async add(req, res) {
    const { name, email, password } = req.body;

    try {
      const user = new User({
        name,
        email,
        verifiedEmail: false,
      });
      await user.addPassword(password);
      await user.add();

      const token = tokens.emailVerification.create(user.id);
      const address = createAddress("/user/verify_email/", token);
      const verificationEmail = new VerificationEmail(user, address);
      verificationEmail.sendEmail().catch(console.log);

      res.status(201).json();
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const accessToken = tokens.access.create(req.user.id);
      const refreshToken = await tokens.refresh.create(req.user.id);
      res.set("Authorization", accessToken);
      res.status(200).json({ refreshToken: refreshToken });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await tokens.access.invalidate(token);
      res.status(204).json();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const users = await User.list();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async verifyEmail(req, res) {
    try {
      const user = req.user;
      await user.verifyEmail();
      res.status(200).json();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async delete(req, res) {
    try {
      const user = await User.getById(req.params.id);
      await user.delete();
      res.status(200).json();
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};
