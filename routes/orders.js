const pool = require("../db/dbConfig");

const ordersRouter = require("express").Router();

//gets all orders
ordersRouter.get("/", async (req, res) => {
  try {
    const orders = await pool.query("SELECT * FROM orders");
    res.send(orders.rows);
  } catch (err) {
    throw err;
  }
});

//gets orders by id
ordersRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    res.send(order.rows[0]);
  } catch (err) {
    throw err;
  }
});

//updates order by id
ordersRouter.put("/:id", async (req, res) => {
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

//deletes order by id
ordersRouter.delete("/:id/cancel", async (req, res) => {
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

module.exports = ordersRouter;
