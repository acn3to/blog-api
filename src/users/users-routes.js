const usersController = require("./users-controller");
const passport = require("passport");

module.exports = (app) => {
  app
    .route("/user/login")
    .post(
      passport.authenticate("local", { session: false }),
      usersController.login
    );

  app.route("/user").get(usersController.list).post(usersController.add);

  app
    .route("/user/:id")
    .delete(
      passport.authenticate("bearer", { session: false }),
      usersController.delete
    );
};
