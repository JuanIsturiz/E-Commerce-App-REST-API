const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const pool = require("./db/dbConfig");

const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await (
        await pool.query("SELECT * FROM users WHERE email = $1", [email])
      ).rows[0];

      if (!user) {
        console.log("no user found");
        return done(null, false);
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (err) throw err;
        if (res) {
          console.log("login successfull!");
          return done(null, user);
        } else {
          console.log("password did not match");
          return done(null, false);
        }
      });
    } catch (err) {
      throw err;
    }
  };

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = (await pool.query("SELECT * FROM users WHERE id = $1", [id]))
        .rows[0];
      return done(null, user);
    } catch (err) {
      throw err;
    }
  });

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
};

module.exports = initialize;
