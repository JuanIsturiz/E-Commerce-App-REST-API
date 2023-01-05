"use strict";

const Pool = require("pg").Pool;
const { DB } = require("../config");

//setup connection to postgres database
const pool = new Pool({
  user: DB.PGUSER,
  host: DB.PGHOST,
  database: DB.PGNAME,
  password: DB.PGPASSWORD,
  port: DB.PGPORT,
});

module.exports = pool;
