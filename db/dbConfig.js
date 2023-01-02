"use strict";

const Pool = require("pg").Pool;
const { DB } = require("../config");

const pool = new Pool({
  user: DB.USER,
  host: DB.HOST,
  database: DB.NAME,
  password: DB.PASSWORD,
  port: DB.PORT,
});

module.exports = pool;
