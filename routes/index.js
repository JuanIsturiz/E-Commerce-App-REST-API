const indexRouter = require("express").Router(),
  homeRouter = require("./home"),
  registerRouter = require("./register"),
  loginRouter = require("./login"),
  usersRouter = require("./users"),
  cartRouter = require("./cart"),
  ordersRouter = require("./orders"),
  productsRouter = require("./products"),
  checkoutRouter = require("./checkout"),
  logoutRouter = require("./logout");

const { isNotAuth } = require("../middlewares/authentication");

//routes setup
indexRouter.use("/", homeRouter);
indexRouter.use("/register", registerRouter);
indexRouter.use("/login", loginRouter);
indexRouter.use("/users", isNotAuth, usersRouter);
indexRouter.use("/cart", isNotAuth, cartRouter);
indexRouter.use("/orders", isNotAuth, ordersRouter);
indexRouter.use("/products", isNotAuth, productsRouter);
indexRouter.use("/checkout", isNotAuth, checkoutRouter);
indexRouter.use("/logout", isNotAuth, logoutRouter);

module.exports = indexRouter;
