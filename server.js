//todo add cart, user and checkout routes

const express = require("express");
const app = express();
const { SESSION_SECRET, PORT } = require("./config");
const session = require("express-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const pool = require("./db/dbConfig");
const bcrypt = require("bcrypt");

//passport initialization
const initializePassport = require("./passport");
initializePassport(passport);

//server setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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

//authentication setup
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("/dashboard");
  next();
};

const isNotAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("user authenticated");
    return next();
  }
  console.log("user not authenticated");
  res.redirect("/login");
};

//home routes
app.get("/", (req, res) => {
  res.send("/home GET request received!");
});

//register routes
app.get("/register", isAuth, (req, res) => {
  res.send("/register GET request received!");
});

app.post("/register", async (req, res) => {
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

//login routes
app.get("/login", isAuth, (req, res) => {
  res.send("/login GET request received!");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

//users routes
app.get("/users", isNotAuth, (req, res) => {
  res.send("/users GET request received!");
});

//profile routes
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.send(`/users/${id} GET request received!`);
});

app.post("/dashboard/profile", async (req, res) => {
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
      console.log(`user updated, new values ${first}`);
    }
    if (!first && last) {
      await pool.query(cases[2].query, cases[2].values);
      console.log(`user updated, new values ${last}`);
    }
    if (first && last) {
      await pool.query(cases[3].query, cases[3].values);
      console.log(`user updated, new values ${first} | ${last}`);
    }
    res.redirect("/dashboard");
  } catch (err) {
    throw err;
  }
});

//logout routes
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    console.log("user logged out..");
    res.redirect("/");
  });
});

//products routes
app.get("/products", async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT * FROM products ORDER BY name ASC"
    );
    res.send(products.rows);
  } catch (err) {
    throw err;
  }
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.send(product.rows[0]);
  } catch (err) {
    throw err;
  }
});

app.post("/products", async (req, res) => {
  const { name, qty, description, price } = req.body;
  try {
    const newProduct = await pool.query(
      "INSERT INTO products (name, stock_qty, description, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, qty, description, price]
    );
    res
      .status(201)
      .send(`new product created with an ID: ${newProduct.rows[0].id}`);
  } catch (err) {
    throw err;
  }
});

app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, qty, description, price } = req.body;
  try {
    const product = await pool.query(
      "UPDATE products SET name = $1, stock_qty = $2, description = $3, price = $4 WHERE id = $5 RETURNING *",
      [name, qty, description, price, id]
    );
    res.send(product.rows[0]);
  } catch (err) {
    throw err;
  }
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.send(`Deleted product with ID: ${id}`);
  } catch (err) {
    throw err;
  }
});

//orders routes
app.get("/orders", async (req, res) => {
  try {
    const orders = await pool.query("SELECT * FROM orders");
    res.send(orders.rows);
  } catch (err) {
    throw err;
  }
});
app.get("orders/id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    res.send(order.rows[0]);
  } catch (err) {
    throw err;
  }
});

app.post("/orders", async (req, res) => {
  const { deliver_date, total, status, user_id, products } = req.body;
  const modified = new Date().toISOString().split("T")[0];

  try {
    const newOrder = await pool.query(
      "INSERT INTO orders (deliver_date, total, status, modified, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [deliver_date, total, status, modified, user_id]
    );

    for (const product of products) {
      const { id, qty, price } = product;
      await pool.query(
        "INSERT INTO order_item (quantity, price, order_id, product_id) VALUES ($1, $2, $3, $4)",
        [qty, price, newOrder.rows[0].id, id]
      );
      await pool.query(
        "UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2",
        [qty, id]
      );
    }
    res
      .status(201)
      .send(
        `Order placed by user: ${user_id} with a total: ${newOrder.rows[0].total}`
      );
  } catch (err) {
    throw err;
  }
});

app.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const modified = new Date().toISOString().split("T")[0];

  try {
    const order = await pool.query(
      "UPDATE orders SET status = $1, modified = $2 WHERE id = $3 RETURNING *",
      [status, modified, id]
    );
    if (order.rows[0].status === "cancelled") {
      res.redirect(`/orders/cancel/${id}`);
    } else {
      res.redirect("/orders");
    }
  } catch (err) {
    throw err;
  }
});

app.delete("/orders/cancel/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT quantity, product_id FROM order_item WHERE order_id = $1",
      [id]
    );

    for (const product of rows) {
      const { quantity, product_id } = product;
      await pool.query(
        "UPDATE products SET stock_qty = stock_qty + $1 WHERE id = $2",
        [quantity, product_id]
      );
    }

    await pool.query("DELETE FROM order_item WHERE order_id = $1", [id]);
    await pool.query("DELETE FROM orders WHERE id = $1", [id]);
    res.send(`Deleted order with ID: ${id}`);
  } catch (err) {
    throw err;
  }
});
//server start
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
