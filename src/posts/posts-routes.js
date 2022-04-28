const postsController = require('./posts-controller');

module.exports = app => {
  app
    .route('/post')
    .get(postsController.list)
    .post(postsController.add);
};
