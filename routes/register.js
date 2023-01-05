const bcrypt = require("bcrypt");
const pool = require("../db/dbConfig");
const { isAuth } = require("../middlewares/authentication");

const registerRouter = require("express").Router();

//main register endpoint
registerRouter.get("/", isAuth, (req, res) => {
  res.send("/register GET request received!");
});

//adds user to database
registerRouter.post("/", async (req, res) => {
  const { first, last, email, password } = req.body;

  let errors = 0;

  if (!email || !password) {
    errors++;
    console.log("password or user missing.");
  }
  if (password.length < 5) {
    errors++;
    console.log("password length too short.");
  }
  if (errors !== 0) {
    console.log(`${errors} errors found! redirecting to register now.`);
    res.redirect("/register");
    return;
  }

  try {
    const { rowCount } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (rowCount > 0) {
      res.redirect("/register");
      console.log("Email already taken.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const { rows } = await pool.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, hashedPass, first, last]
    );
    console.log(
      `user created successfully with ID: ${rows[0].id} and USERNAME: ${rows[0].email}`
    );
    res.send("/register POST request received!");
    res.redirect("/login");
  } catch (err) {
    throw err;
  }
});

module.exports = registerRouter;
