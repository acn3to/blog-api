const db = require("../../database");
const { InternalServerError } = require("../errors");

const { promisify } = require("util");
const dbRun = promisify(db.run).bind(db);
const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

module.exports = {
  async add(user) {
    try {
      await dbRun(
        `INSERT INTO users (name, email, hashPassword, verifiedEmail) 
        VALUES (?, ?, ?, ?)`,
        [user.name, user.email, user.hashPassword, user.verifiedEmail]
      );
    } catch (err) {
      throw new InternalServerError("Error! Add user failed");
    }
  },

  async getById(id) {
    try {
      return await dbGet(`SELECT * FROM users WHERE id = ?`, [id]);
    } catch (err) {
      throw new InternalServerError("User not found!");
    }
  },

  async getByEmail(email) {
    try {
      return await dbGet(`SELECT * FROM users WHERE email = ?`, [email]);
    } catch (err) {
      throw new InternalServerError("User not found!");
    }
  },

  async list() {
    try {
      return await dbAll(`SELECT * FROM users`);
    } catch (err) {
      throw new InternalServerError("Error! List users failed");
    }
  },

  async modifyVerifiedEmail(user, verifiedEmail) {
    try {
      await dbRun(`UPDATE users SET verifiedEmail = ? WHERE ID = ?`, [
        verifiedEmail,
        user.id,
      ]);
    } catch (err) {
      throw new InternalServerError("Error! Modify verified email failed")
    }
  },

  async delete(user) {
    try {
      await dbRun(`DELETE FROM users WHERE id = ?`, [user.id]);
    } catch (err) {
      throw new InternalServerError("Error! Delete user failed");
    }
  },
};
