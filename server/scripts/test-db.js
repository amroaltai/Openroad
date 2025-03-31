import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function testConnection() {
  try {
    console.log("Testing PostgreSQL connection...");
    console.log("Connection URL:", process.env.DATABASE_URL); // Visa bara början för säkerhets skull
    const result = await pool.query("SELECT NOW()");
    console.log("Connection successful!", result.rows[0]);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
