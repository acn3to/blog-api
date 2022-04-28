const postsController = require("./posts-controller");
const passport = require("passport");

module.exports = (app) => {
  app
    .route("/post")
    .get(postsController.list)
    .post(
      passport.authenticate("bearer", { session: false }),
      postsController.add
    );
};
