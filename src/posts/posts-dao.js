const db = require("../../database");
const { InternalServerError } = require("../errors");

const { promisify } = require("util");
const dbRun = promisify(db.run).bind(db);
const dbAll = promisify(db.all).bind(db);

module.exports = {
  async add(post) {
    try {
      await dbRun(`INSERT INTO posts (tittle, content) VALUES (?, ?)`, [
        post.tittle,
        post.content,
      ]);
    } catch (err) {
      throw new InternalServerError("Error! Add post failed");
    }
  },

  async list() {
    try {
      return await dbAll(`SELECT * FROM posts`);
    } catch (err) {
      throw new InternalServerError("Error! List posts failed");
    }
  },
};
