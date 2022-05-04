const usersController = require("./users-controller");
const authMiddlewares = require("./auth-middlewares");

module.exports = (app) => {
  app
    .route("/user/update_token")
    .post(authMiddlewares.refresh, usersController.login);

  app.route("/user/login").post(authMiddlewares.local, usersController.login);

  app
    .route("/user/logout")
    .post(
      [authMiddlewares.refresh, authMiddlewares.bearer],
      usersController.logout
    );

  app.route("/user").get(usersController.list).post(usersController.add);

  app
    .route("/user/verify_email/:token")
    .get(authMiddlewares.emailVerification, usersController.verifyEmail);

  app.route("/user/:id").delete(authMiddlewares.bearer, usersController.delete);
};
