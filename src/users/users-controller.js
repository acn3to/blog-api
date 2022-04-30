const User = require("./users-model");
const { InvalidArgumentError } = require("../errors");
const jwt = require("jsonwebtoken");
const blocklist = require("../../redis/manipulate-blocklist");
const crypto = require("crypto");
const moment = require("moment");

function createJWT(user) {
  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "15m" });
  return token;
}

function createOpaqueToken(user) {
  const opaqueToken = crypto.randomBytes(24).toString("hex");
  const expireDate = moment().add(5, "d").unix();
  
  return opaqueToken;
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
      const accessToken = createJWT(req.user);
      const refreshToken = createOpaqueToken();
      res.set("Authorization", accessToken);
      res.status(200).json({ refreshToken: refreshToken });
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
