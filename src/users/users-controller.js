const User = require("./users-model");
const { InvalidArgumentError, InternalServerError } = require("../errors");

module.exports = {
  add: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const user = new User({
        name,
        email,
        password,
      });

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
