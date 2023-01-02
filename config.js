require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  DB: {
    PGHOST: process.env.PGHOST,
    PGUSER: process.env.PGUSER,
    PGDATABASE: process.env.PGDATABASE,
    PGPASSWORD: process.env.PGPASSWORD,
    PGPORT: process.env.PGPORT,
  },
  SESSION_SECRET: process.env.SESSION_SECRET,
};
