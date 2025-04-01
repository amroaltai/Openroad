// server/scripts/migrate-data.js (uppdaterad för att hantera tidigare uppladdningar och prisdata)
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import pg from "pg";
import cloudinary from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Ladda miljövariabler
dotenv.config();

// Konfigurera filsökvägar för ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfigurera Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// PostgreSQL-anslutning
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Konvertera biltyp till kategorinummer
function getTypeCategory(type) {
  switch (type) {
    case "Economy":
      return 1;
    case "Sport":
      return 2;
    case "SUV":
      return 3;
    case "Convertible":
      return 4;
    case "Luxury":
    default:
      return 5;
  }
}

// Huvudfunktion för migrering
async function migrateData() {
  // SQLite-databas
  let sqliteDb = null;

  // Håll koll på migrationsstatistik
  const stats = {
    total: 0,
    success: 0,
    failed: 0,
    imagesUploaded: 0,
    skipped: 0,
  };

  try {
    console.log("=== MIGRATIONS-SKRIPT STARTAR ===");

    // Verifiera att tabellen finns
    console.log("Verifierar att cars-tabellen finns...");
    const tableCheck = await pgPool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'cars'
      )
    `);

    if (!tableCheck.rows[0].exists) {
      console.log("TABELLEN SAKNAS! Skapar cars-tabellen...");
      await pgPool.query(`
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
          price_per_day DECIMAL(10, 2),
          price_per_week DECIMAL(10, 2),
          price_per_month DECIMAL(10, 2)
        )
      `);
      console.log("Tabellen skapad!");
    } else {
      console.log("Tabellen cars existerar redan.");

      // Kontrollera om priskolumnerna finns, lägg till om de saknas
      console.log("Kontrollerar om priskolumner finns...");
      const columnsCheck = await pgPool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'cars' AND column_name = 'price_per_day'
      `);

      if (columnsCheck.rows.length === 0) {
        console.log("Priskolumner saknas. Lägger till dem...");
        await pgPool.query(`
          ALTER TABLE cars 
          ADD COLUMN price_per_day DECIMAL(10, 2),
          ADD COLUMN price_per_week DECIMAL(10, 2),
          ADD COLUMN price_per_month DECIMAL(10, 2)
        `);
        console.log("Priskolumner tillagda!");
      } else {
        console.log("Priskolumner finns redan.");
      }
    }

    // Öppna SQLite-databasen
    const dbPath = path.join(__dirname, "..", "db", "Cars.db");
    console.log(`SQLite-databasväg: ${dbPath}`);

    sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Hämta alla bilar från SQLite
    console.log("Hämtar bilar från SQLite...");
    const cars = await sqliteDb.all("SELECT * FROM cars");
    stats.total = cars.length;
    console.log(`Hittade ${cars.length} bilar att migrera.`);

    // Kontrollera vilka bilar som redan finns i PostgreSQL
    const existingCars = await pgPool.query("SELECT id FROM cars");
    const existingIds = new Set(existingCars.rows.map((row) => row.id));

    console.log(`Det finns redan ${existingIds.size} bilar i PostgreSQL.`);

    // Gå igenom varje bil
    for (const [index, car] of cars.entries()) {
      try {
        console.log(
          `\nMigrerar bil ${index + 1}/${cars.length}: ${car.brand} ${
            car.model
          } (ID: ${car.id})`
        );

        // Kontrollera om bilen redan finns
        if (existingIds.has(car.id)) {
          console.log(`✓ Bil ${car.id} finns redan i PostgreSQL, hoppar över.`);
          stats.skipped++;
          continue;
        }

        // Hantera bilduppladdningar för varje bil
        const imageUrls = {
          image1: car.image1,
          image2: car.image2,
          image3: car.image3,
        };

        // Processera varje bildfält
        for (const field of ["image1", "image2", "image3"]) {
          if (!car[field]) continue;

          const imagePath = car[field];
          console.log(`Processar ${field}: ${imagePath}`);

          // Kontrollera om det är en lokal fil
          if (imagePath.startsWith("/uploads/")) {
            const localPath = path.join(__dirname, "..", imagePath);

            // Kontrollera om filen existerar
            if (fs.existsSync(localPath)) {
              try {
                console.log(
                  `Laddar upp ${field} till Cloudinary: ${localPath}`
                );

                // Ladda upp till Cloudinary
                const result = await cloudinary.v2.uploader.upload(localPath, {
                  folder: "car-images",
                });

                // Uppdatera URL till Cloudinary-URL
                imageUrls[field] = result.secure_url;
                stats.imagesUploaded++;

                console.log(`✓ Bild uppladdad: ${result.secure_url}`);
              } catch (uploadError) {
                console.error(
                  `✗ VARNING: Kunde inte ladda upp bild ${field}:`,
                  uploadError.message
                );
                // Behåll ursprunglig URL om uppladdning misslyckas
              }
            } else {
              console.log(`✗ VARNING: Bildfil finns inte: ${localPath}`);
            }
          } else {
            console.log(
              `${field} är redan en URL eller behövs inte laddas upp`
            );
          }
        }

        // Konvertera typ till kategorinummer
        const category = getTypeCategory(car.type);

        // Sätt default-värden för priser (null)
        const price_per_day = null;
        const price_per_week = null;
        const price_per_month = null;

        // Infoga bil i PostgreSQL med priskolumner
        const result = await pgPool.query(
          `INSERT INTO cars (
            id, brand, model, year, image1, image2, image3, 
            color, seats, horsepower, type, category,
            price_per_day, price_per_week, price_per_month
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`,
          [
            car.id, // Använd original ID för att matcha
            car.brand,
            car.model,
            car.year,
            imageUrls.image1,
            imageUrls.image2,
            imageUrls.image3,
            car.color,
            car.seats,
            car.horsepower,
            car.type || "Luxury",
            category,
            price_per_day,
            price_per_week,
            price_per_month,
          ]
        );

        console.log(`✓ Bil inlagd i PostgreSQL med ID: ${result.rows[0].id}`);
        stats.success++;
      } catch (carError) {
        console.error(
          `✗ FEL: Kunde inte migrera bil ${car.id}:`,
          carError.message
        );
        stats.failed++;
      }
    }

    // Visa slutresultat
    console.log("\n=== MIGRATIONS-SAMMANFATTNING ===");
    console.log(`Totalt antal bilar: ${stats.total}`);
    console.log(`Lyckade migreringar: ${stats.success}`);
    console.log(`Misslyckade migreringar: ${stats.failed}`);
    console.log(`Hoppade över (redan migrerade): ${stats.skipped}`);
    console.log(`Uppladdade bilder: ${stats.imagesUploaded}`);
    console.log("===============================");

    if (stats.failed > 0) {
      console.log("\nVARNING: Några bilar kunde inte migreras. Se fel ovan.");
    } else {
      console.log("\nMigrationen slutförd utan fel!");
    }
  } catch (error) {
    console.error("\n✗ KRITISKT FEL under migration:", error);
  } finally {
    // Stäng anslutningar
    if (sqliteDb) {
      await sqliteDb.close();
      console.log("SQLite-anslutning stängd");
    }

    await pgPool.end();
    console.log("PostgreSQL-anslutning stängd");

    console.log("\nMigrationsskript avslutat.");
  }
}

// Kör migreringen
migrateData();
