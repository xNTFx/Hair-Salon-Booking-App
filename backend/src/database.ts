import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.VPS_HOST,
  database: process.env.DB_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT, 10)
});

export default pool;
