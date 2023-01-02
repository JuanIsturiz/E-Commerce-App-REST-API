const pool = require("./connection");
const bcrypt = require("bcrypt");

//check if the email is already taken
const checkDuplicate = async (email) => {
  const text = "SELECT email from accounts where email = $1";
  const values = [email];
  try {
    const { rowCount } = await pool.query(text, values);
    return rowCount;
  } catch (err) {
    console.log(err.stack);
  }
};

//helper that hashes password with bcrypt
const hashPassword = async (pass, saltNum) => {
  try {
    const salt = await bcrypt.genSalt(saltNum);
    const hash = await bcrypt.hash(pass, salt);
    return hash;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//adds new user to the DB if the email is not already taken
const addNewUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  const check = await checkDuplicate(email);

  if (check) {
    console.log("User already exists!");
    res.status(400).send("User already exists!");
    return;
  }

  const hashedPassword = await hashPassword(password, 10);

  const text =
    "INSERT into accounts (email, password, first_name, last_name) values ($1, $2, $3, $4) RETURNING *";
  const values = [email, hashedPassword, first_name, last_name];

  try {
    const results = await pool.query(text, values);
    res
      .status(201)
      .send(`Account created successfully with the ID: ${results.rows[0].id}`);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  addNewUser,
};

/* //GET all users
const getUsers = (req, res) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

// GET a single user by ID
const getUserById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
    if (err) {
      throw err;
    }
    res.status(200).json(results.rows);
  });
};

// POST a new user
const createUser = (req, res) => {
  const { name, password, age } = req.body;
  pool.query(
    "INSERT INTO users (name, password, age) VALUES ($1, $2, $3) RETURNING *",
    [name, password, age],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(201).send("user added with ID: " + results.rows[0].id);
    }
  );
};

// PUT updated data in an existing user
const updateUser = (req, res) => {
  console.log(req.body);
  const id = parseInt(req.params.id);
  const { name, password, age } = req.query;

  pool.query(
    "UPDATE users set name = $1, password = $2, age = $3 where id = $4",
    [name, password, age, id],
    (err, results) => {
      if (err) {
        throw err;
      }
      res.status(200).send("Updated user with the ID:" + id);
    }
  );
};

// DELETE user
const deleteUser = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query("DELETE from users WHERE id = $1", [id], (err, results) => {
    if (err) throw err;
    res.status(200).send("Deleted user with ID: " + id);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
 */
