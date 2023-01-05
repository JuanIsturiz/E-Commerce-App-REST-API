const passport = require("passport");
const { isAuth } = require("../middlewares/authentication");

const loginRouter = require("express").Router();

//main login endpoint
loginRouter.get("/", isAuth, (req, res) => {
  res.send("/login GET request received!");
});

//logs user with passport
loginRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

module.exports = loginRouter;
