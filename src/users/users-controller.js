const User = require("./users-model");
const { InvalidArgumentError, InternalServerError } = require("../errors");
const jwt = require("jsonwebtoken");
const blacklist = require("../../redis/manipulate-blacklist");

function createJWT(user) {
  const payload = {
    id: user.id,
  };

  return jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "15m" });
}

module.exports = {
  add: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const user = new User({
        name,
        email,
      });

      await user.addPassword(password);

      await user.add();

      res.status(201).send(user);
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        res.status(422).json({ error: err.message });
      } else if (err instanceof InternalServerError) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  },

  login: (req, res) => {
    const token = createJWT(req.user);
    res.set("Authorization", token);
    res.status(204).send();
  },

  logout: async (req, res) => {
    try {
      const token = req.token;
      await blacklist.add(token);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  },

  list: async (_req, res) => {
    const users = await User.list();
    res.json(users);
  },

  delete: async (req, res) => {
    const user = await User.getById(req.params.id);
    try {
      await user.delete();
      res.status(200).send();
    } catch (err) {
      res.status(500).json({ error: err });
    }
  },
};
