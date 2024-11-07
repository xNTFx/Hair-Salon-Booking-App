import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hairdresser",
  password: "admin",
  port: 5432,
});

export default pool;