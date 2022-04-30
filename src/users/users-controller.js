const User = require("./users-model");
const { InvalidArgumentError } = require("../errors");
const jwt = require("jsonwebtoken");
const blocklist = require("../../redis/manipulate-blocklist");

function createJWT(user) {
  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "15m" });
  return token;
}

module.exports = {
  async add(req, res) {
    const { name, email, password } = req.body;

    try {
      const user = new User({
        name,
        email,
      });
      await user.addPassword(password);
      await user.add();

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
      const token = createJWT(req.user);
      res.set("Authorization", token);
      res.status(204).json();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await blocklist.add(token);
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
