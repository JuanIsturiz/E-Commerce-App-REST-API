const pool = require("../db/dbConfig");

const cartRouter = require("express").Router();

//get all carts info
cartRouter.get("/", async (req, res) => {
  try {
    const carts = await pool.query("SELECT * FROM carts");
    res.send(carts.rows);
  } catch (err) {
    throw err;
  }
});

//get cart info by id
cartRouter.get("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = $1",
      [cartId]
    );
    res.send(cart.rows);
  } catch (err) {
    throw err;
  }
});

//create new cart
cartRouter.post("/", async (req, res) => {
  const created = new Date().toISOString().split("T")[0];
  try {
    const cart = await pool.query(
      "INSERT INTO carts (created) VALUES ($1) RETURNING *",
      [created]
    );
    res.send(`new cart created with ID: ${cart.rows[0].id}`);
  } catch (err) {
    throw err;
  }
});

//add items to cart by cartId and userId
cartRouter.post("/:cartId/users/:userId", async (req, res) => {
  const { cartId, userId } = req.params;
  const { quantity, product_id } = req.body;
  const modified = new Date().toISOString().split("T")[0];

  try {
    await pool.query("UPDATE carts SET modified = $1 WHERE id = $2", [
      modified,
      cartId,
    ]);

    const newItem = await pool.query(
      "INSERT INTO cart_items (quantity, modified, user_id, product_id, cart_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [quantity, modified, userId, product_id, cartId]
    );
    res.send(newItem.rows[0]);
  } catch (err) {
    throw err;
  }
});

//delete whole cart
cartRouter.delete("/:cartId", async (req, res) => {
  const { cartId } = req.params;
  try {
    await pool.query("DELETE FROM carts WHERE id = $1", [cartId]);
    res.send(`Deleted cart with ID: ${cartId}`);
  } catch (err) {
    throw err;
  }
});

//delete items from given userId
cartRouter.delete("/cartItem/:id", async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;
  try {
    await pool.query(
      "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *",
      [id, product_id]
    );
    const itemName = await pool.query(
      "SELECT name FROM products WHERE id = $1",
      [product_id]
    );
    res.send(`Succesfully deleted ${itemName.rows[0]} from cart!`);
  } catch (err) {
    throw err;
  }
});

module.exports = cartRouter;
