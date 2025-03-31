// server/scripts/fix-schema-category.js
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

async function fixSchema() {
  try {
    console.log("Kontrollerar och fixar tabellschema...");

    // 1. Hämta nuvarande tabellstruktur
    const tableInfoResult = await pool.query(`
      SELECT column_name, is_nullable, data_type
      FROM information_schema.columns 
      WHERE table_name = 'cars'
      ORDER BY ordinal_position
    `);

    console.log("Nuvarande tabellstruktur:");
    tableInfoResult.rows.forEach((row) => {
      console.log(
        `${row.column_name} - ${row.data_type} - ${
          row.is_nullable === "YES" ? "Nullable" : "NOT NULL"
        }`
      );
    });

    // 2. Kontrollera om category_id finns och inte category
    const categoryIdExists = tableInfoResult.rows.some(
      (row) => row.column_name === "category_id"
    );
    const categoryExists = tableInfoResult.rows.some(
      (row) => row.column_name === "category"
    );

    if (categoryIdExists && !categoryExists) {
      console.log(
        'Kolumnen heter "category_id" istället för "category". Lägger till en category-kolumn...'
      );

      // Skapa en ny category-kolumn och kopiera data från category_id
      await pool.query(`ALTER TABLE cars ADD COLUMN category INTEGER`);
      await pool.query(`UPDATE cars SET category = category_id`);

      console.log("Kategoridata kopierat från category_id till category.");
    } else if (!categoryIdExists && categoryExists) {
      console.log('Kolumnen "category" används redan korrekt.');
    } else if (categoryIdExists && categoryExists) {
      console.log(
        'Både "category_id" och "category" finns. Synkroniserar värden...'
      );
      await pool.query(
        `UPDATE cars SET category = category_id WHERE category IS NULL`
      );
      await pool.query(
        `UPDATE cars SET category_id = category WHERE category_id IS NULL`
      );
    } else {
      console.log(
        'Varken "category_id" eller "category" finns. Lägger till category-kolumn...'
      );
      await pool.query(`ALTER TABLE cars ADD COLUMN category INTEGER`);
    }

    // 3. Kontrollera om category_id har NOT NULL-constraint
    if (categoryIdExists) {
      const notNullConstraints = await pool.query(`
        SELECT c.column_name, c.is_nullable
        FROM information_schema.columns c
        WHERE c.table_name = 'cars' AND c.column_name = 'category_id' AND c.is_nullable = 'NO'
      `);

      if (notNullConstraints.rows.length > 0) {
        console.log("Ändrar category_id till att tillåta NULL-värden...");
        await pool.query(
          `ALTER TABLE cars ALTER COLUMN category_id DROP NOT NULL`
        );
      }
    }

    // 4. Sätt standardvärde för category/category_id (använd 5 för Luxury)
    console.log(
      "Uppdaterar NULL-värden i kategorikolumner till standardvärdet 5 (Luxury)..."
    );

    if (categoryExists) {
      await pool.query(`UPDATE cars SET category = 5 WHERE category IS NULL`);
    }

    if (categoryIdExists) {
      await pool.query(
        `UPDATE cars SET category_id = 5 WHERE category_id IS NULL`
      );
    }

    // 5. Ta en koll på den uppdaterade strukturen
    const updatedTableInfo = await pool.query(`
      SELECT column_name, is_nullable, data_type
      FROM information_schema.columns 
      WHERE table_name = 'cars'
      ORDER BY ordinal_position
    `);

    console.log("\nUppdaterad tabellstruktur:");
    updatedTableInfo.rows.forEach((row) => {
      console.log(
        `${row.column_name} - ${row.data_type} - ${
          row.is_nullable === "YES" ? "Nullable" : "NOT NULL"
        }`
      );
    });

    console.log("\nSchemafix klart! Nu kan du köra migrate-data.js igen.");
  } catch (error) {
    console.error("Fel vid fixande av schema:", error);
  } finally {
    await pool.end();
  }
}

fixSchema();
