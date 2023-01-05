const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const { SESSION_SECRET, PORT } = require("./config");
const cors = require("cors");

//passport initialization
const initializePassport = require("./passport");
const indexRouter = require("./routes");
initializePassport(passport);

//server setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// session setup
app.use(
  session({
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      maxAge: 30 * 60 * 1000,
    },
    saveUninitialized: false,
    resave: false,
    sameSite: "none",
  })
);

//passport setup
app.use(passport.initialize());
app.use(passport.session());

//main router setup
app.use(indexRouter);

//server start
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
