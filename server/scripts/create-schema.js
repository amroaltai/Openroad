// server/scripts/create-schema.js
import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Ladda miljövariabler
dotenv.config();

// Konfigurera filsökvägar för ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Skapa pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function createSchema() {
  try {
    console.log("Ansluter till PostgreSQL...");

    // Skapa cars-tabellen
    console.log("Skapar cars-tabellen...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cars (
        id SERIAL PRIMARY KEY,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        image1 TEXT,
        image2 TEXT,
        image3 TEXT,
        color TEXT,
        seats INTEGER,
        horsepower INTEGER,
        type TEXT,
        category INTEGER,
        price_per_day DECIMAL(10, 2) DEFAULT NULL,
        price_per_week DECIMAL(10, 2) DEFAULT NULL,
        price_per_month DECIMAL(10, 2) DEFAULT NULL
      )
    `);

    console.log("Tabellen cars har skapats framgångsrikt!");

    // Verifiera att tabellen finns
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log("Tillgängliga tabeller i databasen:");
    tablesResult.rows.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    return true;
  } catch (error) {
    console.error("Fel vid skapande av schema:", error);
    return false;
  } finally {
    await pool.end();
    console.log("PostgreSQL-anslutning stängd");
  }
}

// Kör skapandet av schema
createSchema();
