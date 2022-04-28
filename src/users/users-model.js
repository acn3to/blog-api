const usersDao = require("./users-dao");
const { InvalidArgumentError } = require("../errors");
const validations = require("../common-validations");

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;

    this.validate();
  }

  async add() {
    if (await User.getByEmail(this.email)) {
      throw new InvalidArgumentError("The user already exists!");
    }

    return usersDao.add(this);
  }

  validate() {
    validations.stringFieldNotNull(this.name, "name");
    validations.stringFieldNotNull(this.email, "email");
    validations.stringFieldNotNull(this.password, "password");
    validations.minFieldSize(this.password, "password", 8);
    validations.maxFieldSize(this.password, "password", 64);
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
}

module.exports = User;
