const db = require("../../database");
const { InternalServerError } = require("../errors");

module.exports = {
  add: (user) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          INSERT INTO users (
            name,
            email,
            password
          ) VALUES (?, ?, ?)
        `,
        [user.name, user.email, user.password],
        (err) => {
          if (err) {
            reject(new InternalServerError("Error! Add user failed"));
          }

          return resolve();
        }
      );
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM users
          WHERE id = ?
        `,
        [id],
        (err, user) => {
          if (err) {
            return reject("User not found!");
          }

          return resolve(user);
        }
      );
    });
  },

  getByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        `
          SELECT *
          FROM users
          WHERE email = ?
        `,
        [email],
        (err, user) => {
          if (err) {
            return reject("User not found!");
          }

          return resolve(user);
        }
      );
    });
  },

  list: () => {
    return new Promise((resolve, reject) => {
      db.all(
        `
          SELECT * FROM users
        `,
        (err, users) => {
          if (err) {
            return reject("Error! List users failed");
          }
          return resolve(users);
        }
      );
    });
  },

  delete: (user) => {
    return new Promise((resolve, reject) => {
      db.run(
        `
          DELETE FROM users
          WHERE id = ?
        `,
        [user.id],
        (err) => {
          if (err) {
            return reject("Error! Delete user failed");
          }
          return resolve();
        }
      );
    });
  },
};
