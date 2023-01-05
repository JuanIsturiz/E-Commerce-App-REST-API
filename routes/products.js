const pool = require("../db/dbConfig");

const productsRouter = require("express").Router();

//gets all products
productsRouter.get("/", async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT * FROM products ORDER BY name ASC"
    );
    res.send(products.rows);
  } catch (err) {
    throw err;
  }
});

//gets product by id
productsRouter.get("/:id", async (req, res) => {
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

//adds a product to database
productsRouter.post("/", async (req, res) => {
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

//updates a product by id
productsRouter.put("/:id", async (req, res) => {
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

//deletes a product by id
productsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.send(`Deleted product with ID: ${id}`);
  } catch (err) {
    throw err;
  }
});

module.exports = productsRouter;
