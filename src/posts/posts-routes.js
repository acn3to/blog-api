const postsController = require("./posts-controller");
const { authMiddlewares } = require("../users");

module.exports = (app) => {
  app
    .route("/post")
    .get(postsController.list)
    .post(authMiddlewares.bearer, postsController.add);
};
