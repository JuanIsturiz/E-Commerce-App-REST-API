/* const express = require("express"),
  loginRouter = express.Router(),
  passport = require("passport");

loginRouter.get("/", (req, res) => {
  res.send("Server login!");
});

loginRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.send("login successfull!");
  }
);

module.exports = loginRouter;
 */
