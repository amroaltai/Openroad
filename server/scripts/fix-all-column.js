// server/scripts/fix-all-columns.js
import pg from "pg";
import dotenv from "dotenv";

// Ladda miljövariabler
dotenv.config();

// Skapa PostgreSQL-anslutning
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fixColumnIssues() {
  try {
    console.log("Kontrollerar och lägger till saknade kolumner...");

    // Hämta alla existerande kolumner för cars-tabellen
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'cars'
    `);

    const existingColumns = columns.rows.map((row) => row.column_name);
    console.log("Befintliga kolumner:", existingColumns.join(", "));

    // Kontrollera och lägg till type-kolumnen
    if (!existingColumns.includes("type")) {
      console.log('Kolumnen "type" saknas. Lägger till den...');
      await pool.query(`ALTER TABLE cars ADD COLUMN type TEXT`);
      console.log('✓ Kolumnen "type" har lagts till framgångsrikt!');
    } else {
      console.log('✓ Kolumnen "type" finns redan.');
    }

    // Kontrollera och lägg till category-kolumnen
    if (!existingColumns.includes("category")) {
      console.log('Kolumnen "category" saknas. Lägger till den...');
      await pool.query(`ALTER TABLE cars ADD COLUMN category INTEGER`);
      console.log('✓ Kolumnen "category" har lagts till framgångsrikt!');
    } else {
      console.log('✓ Kolumnen "category" finns redan.');
    }

    // Lista alla kolumner i cars-tabellen
    const updatedColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'cars'
    `);

    console.log(
      "Kolumner efter uppdatering:",
      updatedColumns.rows.map((row) => row.column_name).join(", ")
    );
    console.log("Klart! Nu kan du köra migrate-data.js igen.");
  } catch (error) {
    console.error("Fel vid fixande av kolumner:", error);
  } finally {
    await pool.end();
  }
}

fixColumnIssues();
