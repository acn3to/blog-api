const usersController = require("./users-controller");
const authMiddlewares = require("./auth-middlewares");

module.exports = (app) => {
  app
  .route("/user/login")
  .post(authMiddlewares.local, usersController.login);

  app
  .route("/user/logout")
  .get(authMiddlewares.bearer, usersController.logout);

  app
  .route("/user")
  .get(usersController.list)
  .post(usersController.add);

  app
  .route("/user/:id")
  .delete(authMiddlewares.bearer, usersController.delete);
};
