const Post = require('./posts-model');
const { InvalidArgumentError, InternalServerError } = require('../errors');

module.exports = {
  add: async (req, res) => {
    try {
      const post = new Post(req.body);
      await post.add();
      
      res.status(201).send(post);
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
    try {
      const posts = await Post.list();
      res.send(posts);
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
};
