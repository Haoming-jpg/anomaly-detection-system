const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // your PostgreSQL username
  host: 'localhost',
  database: 'anomaly_detection',  // your database name
  password: 'Aqwer123', // your PostgreSQL password
  port: 5432,                 // default PostgreSQL port
});

module.exports = pool;
