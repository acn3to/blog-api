const usersDao = require("./users-dao");
const { InvalidArgumentError } = require("../errors");
const validations = require("../common-validations");
const bcrypt = require("bcrypt");

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.hashPassword = user.hashPassword;
    this.verifiedEmail = user.verifiedEmail;
    this.validate();
  }

  async add() {
    if (await User.getByEmail(this.email)) {
      throw new InvalidArgumentError("User already exists!");
    }

    await usersDao.add(this);
    const { id } = await usersDao.getByEmail(this.email);
    this.id = id;
  }

  async addPassword(password) {
    validations.stringFieldNotNull(password, "password");
    validations.minFieldSize(password, "password", 8);
    validations.maxFieldSize(password, "password", 64);
    this.hashPassword = await User.generateHashPassword(password);
  }

  validate() {
    validations.stringFieldNotNull(this.name, "name");
    validations.stringFieldNotNull(this.email, "email");
  }

  async verifyEmail() {
    this.verifiedEmail = true;
    await usersDao.modifyVerifiedEmail(this, this.verifiedEmail);
  }

  async delete() {
    return usersDao.delete(this);
  }

  static async getById(id) {
    const user = await usersDao.getById(id);
    if (!user) {
      return null;
    }

    return new User(user);
  }

  static async getByEmail(email) {
    const user = await usersDao.getByEmail(email);
    if (!user) {
      return null;
    }

    return new User(user);
  }

  static list() {
    return usersDao.list();
  }

  static generateHashPassword(password) {
    const hashCost = 12;
    return bcrypt.hash(password, hashCost);
  }
}

module.exports = User;
