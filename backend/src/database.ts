import dotenv from "dotenv";
dotenv.config();
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.VPS_HOST,
  database: process.env.DB_NAME,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

export default pool;
