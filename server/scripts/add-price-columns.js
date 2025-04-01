// server/scripts/add-price-columns.js
import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create a connection pool (using the same config as in database.js)
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function addPriceColumns() {
  try {
    console.log("===== PRICE COLUMNS UPDATE SCRIPT =====");
    console.log("Connecting to PostgreSQL...");

    // Test database connection
    const testConn = await pool.query("SELECT NOW()");
    console.log(`Connected to PostgreSQL at ${testConn.rows[0].now}`);

    // Check if price columns already exist
    const columnsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'cars'
      AND column_name IN ('price_per_day', 'price_per_week', 'price_per_month');
    `);

    const existingColumns = columnsCheck.rows.map((row) => row.column_name);
    console.log(
      `Found existing price columns: ${
        existingColumns.length > 0 ? existingColumns.join(", ") : "none"
      }`
    );

    // Add missing columns
    if (
      existingColumns.includes("price_per_day") &&
      existingColumns.includes("price_per_week") &&
      existingColumns.includes("price_per_month")
    ) {
      console.log("All price columns already exist! No changes needed.");
    } else {
      console.log("Adding missing price columns...");

      // Add price_per_day if missing
      if (!existingColumns.includes("price_per_day")) {
        await pool.query(`
          ALTER TABLE cars 
          ADD COLUMN price_per_day DECIMAL(10, 2) DEFAULT NULL
        `);
        console.log("Added price_per_day column ✅");
      }

      // Add price_per_week if missing
      if (!existingColumns.includes("price_per_week")) {
        await pool.query(`
          ALTER TABLE cars 
          ADD COLUMN price_per_week DECIMAL(10, 2) DEFAULT NULL
        `);
        console.log("Added price_per_week column ✅");
      }

      // Add price_per_month if missing
      if (!existingColumns.includes("price_per_month")) {
        await pool.query(`
          ALTER TABLE cars 
          ADD COLUMN price_per_month DECIMAL(10, 2) DEFAULT NULL
        `);
        console.log("Added price_per_month column ✅");
      }

      console.log("Price columns added successfully!");
    }

    // Final verification of columns
    const finalCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      AND table_name = 'cars'
      AND column_name IN ('price_per_day', 'price_per_week', 'price_per_month')
      ORDER BY column_name;
    `);

    console.log("\nVerified columns in database:");
    finalCheck.rows.forEach((row) => {
      console.log(`- ${row.column_name} ✅`);
    });

    console.log("\n===== PRICE COLUMNS UPDATE COMPLETED SUCCESSFULLY =====");
    return true;
  } catch (error) {
    console.error("ERROR updating price columns:", error);
    return false;
  } finally {
    await pool.end();
    console.log("Database connection closed");
  }
}

// Run the function
addPriceColumns()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
