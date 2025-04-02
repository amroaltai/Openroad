// File: server/db/database.js
import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config();

// Set up dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Create a simple wrapper around pool.query for easier use
export const db = {
  query: (text, params) => pool.query(text, params),
};

// Function to initialize the database schema
export const initDatabase = async () => {
  try {
    console.log("Initializing database schema...");

    // Read and execute the schema SQL
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf8");

    await pool.query(schemaSQL);
    console.log("Database schema initialized successfully");

    // Sync primary key sequence with existing data
    await syncPrimaryKeySequence();

    // Check if we need to seed the database with sample data
    const carCount = await pool.query("SELECT COUNT(*) FROM cars");

    if (parseInt(carCount.rows[0].count) === 0) {
      console.log("No cars found in database, adding sample data...");
      await seedSampleData();
      await syncPrimaryKeySequence();
    } else {
      console.log(`Database already contains ${carCount.rows[0].count} cars`);
      await syncPrimaryKeySequence();
    }

    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

// Function to synchronize primary key sequence
async function syncPrimaryKeySequence() {
  try {
    const result = await pool.query(`
      SELECT setval('cars_id_seq', (SELECT MAX(id) FROM cars), true)
    `);
    console.log(
      `Primary key sequence synchronized to ${result.rows[0].setval}`
    );
  } catch (error) {
    console.error("Error syncing primary key sequence:", error.message);
    throw error;
  }
}

// Function to seed the database with sample data
async function seedSampleData() {
  try {
    const sampleCars = [
      {
        brand: "Lamborghini",
        model: "Huracán",
        year: 2023,
        image1:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/lamborghini-1",
        image2:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/lamborghini-2",
        image3:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/lamborghini-3",
        color: "Gul",
        seats: 2,
        horsepower: 640,
        type: "Sport",
        category: 2,
      },
      {
        brand: "Mercedes-Benz",
        model: "G63 AMG",
        year: 2023,
        image1:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/g63-1",
        image2:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/g63-2",
        image3:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/g63-3",
        color: "Svart",
        seats: 5,
        horsepower: 577,
        type: "SUV",
        category: 3,
      },
      {
        brand: "Rolls-Royce",
        model: "Cullinan",
        year: 2023,
        image1:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/rolls-1",
        image2:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/rolls-2",
        image3:
          "https://res.cloudinary.com/dwwhagql2/image/upload/v1/car-images/rolls-3",
        color: "Silver",
        seats: 5,
        horsepower: 563,
        type: "Luxury",
        category: 5,
      },
    ];

    // Insert each sample car
    for (const car of sampleCars) {
      await pool.query(
        `INSERT INTO cars (brand, model, year, image1, image2, image3, color, seats, horsepower, type, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          car.brand,
          car.model,
          car.year,
          car.image1,
          car.image2,
          car.image3,
          car.color,
          car.seats,
          car.horsepower,
          car.type,
          car.category,
        ]
      );
    }

    console.log("Sample car data inserted successfully");
  } catch (error) {
    console.error("Error seeding database:", error.message);
    throw error;
  }
}
