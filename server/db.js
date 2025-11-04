import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432, //Puerto por defecto
});

const db = {
  query: ({ text, params }) => pool.query(text, params),
  pool,
};

export default db;
