const pool = require("../db/dbConfig");

const usersRouter = require("express").Router();

//gets all users
usersRouter.get("/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.send(users.rows);
  } catch (err) {
    throw err;
  }
});

//gets user by id
usersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query("SELECT * FROM users WHERE id =$1", [id]);
    res.send(user.rows[0]);
  } catch (err) {
    throw err;
  }
});

//updates an user by id
usersRouter.put("/:id", async (req, res) => {
  const { id } = req.user;
  const { first, last } = req.body;

  const cases = {
    1: {
      query: "UPDATE users SET first_name = $1 WHERE id = $2 RETURNING *",
      values: [first, id],
    },
    2: {
      query: "UPDATE users SET last_name = $1 WHERE id = $2 RETURNING *",
      values: [last, id],
    },
    3: {
      query:
        "UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *",
      values: [first, last, id],
    },
  };

  try {
    if (first && !last) {
      await pool.query(cases[1].query, cases[1].values);
      res.send(`user updated, new values ${first}`);
    }
    if (!first && last) {
      await pool.query(cases[2].query, cases[2].values);
      res.send(`user updated, new values ${last}`);
    }
    if (first && last) {
      await pool.query(cases[3].query, cases[3].values);
      res.send(`user updated, new values ${first} | ${last}`);
    }
    res.redirect(`/user/${id}`);
  } catch (err) {
    throw err;
  }
});

//deletes an user by id
usersRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    res.send(`Deleted user with ID: ${id}`);
  } catch (err) {
    throw err;
  }
});

module.exports = usersRouter;
