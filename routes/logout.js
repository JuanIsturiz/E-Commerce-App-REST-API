const logoutRouter = require("express").Router();

//logs out user
logoutRouter.get("/", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log("user logged out..");
    res.redirect("/");
  });
});

module.exports = logoutRouter;
