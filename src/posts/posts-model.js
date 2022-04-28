const postsDao = require('./posts-dao');
const validations = require('../common-validations');

class Post {
  constructor(post) {
    this.tittle = post.tittle;
    this.content = post.content;
    this.validate();
  }

  add() {
    return postsDao.add(this);
  }

  validate() {
    validations.stringFieldNotNull(this.tittle, 'tittle');
    validations.minFieldSize(this.tittle, 'tittle', 5);

    validations.stringFieldNotNull(this.content, 'content');
    validations.maxFieldSize(this.content, 'content', 140);
  }

  static list() {
    return postsDao.list();
  }
}

module.exports = Post;
