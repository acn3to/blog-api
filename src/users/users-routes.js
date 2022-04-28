const usersController = require("./users-controller");

module.exports = (app) => {
  app
  .route("/user")
  .get(usersController.list)
  .post(usersController.add);

  app
  .route("/user/:id")
  .delete(usersController.delete);
};
