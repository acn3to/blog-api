const db = require('../../database');

module.exports = {
  add: post => {
    return new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO posts (
          tittle, 
          content
        ) VALUES (?, ?)
      `,
        [post.tittle, post.content],
        err => {
          if (err) {
            return reject('Error! Add post failed');
          }

          return resolve();
        }
      );
    });
  },

  list: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM posts`, (err, results) => {
        if (err) {
          return reject('Error! List posts failed');
        }

        return resolve(results);
      });
    });
  }
};
