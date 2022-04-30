const Post = require("./posts-model");
const { InvalidArgumentError } = require("../errors");

module.exports = {
  async add(req, res) {
    try {
      const post = new Post(req.body);
      await post.add();

      res.status(201).json(post);
    } catch (err) {
      if (err instanceof InvalidArgumentError) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const posts = await Post.list();
      res.json(posts);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
