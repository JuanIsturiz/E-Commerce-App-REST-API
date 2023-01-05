const { Client } = require("pg");
const { DB } = require("./config");

(async () => {
  const createUsersTb = `
    CREATE TABLE IF NOT EXISTS users (
      id          BIGSERIAL    PRIMARY KEY NOT NULL,
      email       VARCHAR(50) NOT NULL,
      password    TEXT NOT NULL,
      first_name  VARCHAR(50),
      last_name   VARCHAR(50)
  );
`;

  const createCartTb = `
    CREATE TABLE IF NOT EXISTS carts (
      id          BIGSERIAL    PRIMARY KEY NOT NULL,
      created     DATE,
      modified    DATE
  );
`;

  const createProductsTb = `
    CREATE TABLE IF NOT EXISTS products (
      id          BIGSERIAL PRIMARY KEY NOT NULL,
      name        VARCHAR(50),
      stock_qty   INT,
      description INT,
      price       INT
  );
`;

  const createOrdersTb = `
    CREATE TABLE IF NOT EXISTS orders (
      id            BIGSERIAL PRIMARY KEY NOT NULL,
      deliver_date  DATE,
      total         MONEY,
      status        VARCHAR(20),
      modified      DATE,
      user_id       INT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

  const createOrderItemTb = `
    CREATE TABLE IF NOT EXISTS order_item (
      id            BIGSERIAL PRIMARY KEY NOT NULL,
      quantity      INT,
      price         MONEY,
      order_id      INT,
      product_id    INT,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
  );
`;

  const createCartItemsTb = `
    CREATE TABLE IF NOT EXISTS cart_items (
      id          BIGSERIAL PRIMARY KEY NOT NULL,
      quantity    INT,
      modified    DATE,
      user_id     INT,
      product_id  INT,
      cart_id     INT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (cart_id) REFERENCES carts(id)
  );
`;
  try {
    const db = new Client({
      user: DB.USER,
      host: DB.HOST,
      database: DB.NAME,
      password: DB.PASSWORD,
      port: DB.PORT,
    });

    await db.connect();
    await db.query(createUsersTb);
    await db.query(createCartTb);
    await db.query(createProductsTb);
    await db.query(createOrdersTb);
    await db.query(createOrderItemTb);
    await db.query(createCartItemsTb);
    await db.end();
  } catch (err) {
    throw err;
  }
})();
