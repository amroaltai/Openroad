import express from "express";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Uppdaterad CORS-konfiguration för att inkludera Render-domän och alla subdomäner
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://openroad.onrender.com",
      /\.onrender\.com$/, // Tillåter alla Render-subdomäner
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Serva statiska filer från tidigare public-mapp
app.use(express.static(path.join(__dirname, "..", "public")));

// Serva byggda frontend-filer från client/dist
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

// Skapa uploads-mapp om den inte finns
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

async function setupDatabase() {
  const dbPath = path.join(__dirname, "db", "Cars.db");

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  console.log(`Attempting to connect to database at: ${dbPath}`);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  console.log("Database connection established");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      image1 TEXT NOT NULL,
      image2 TEXT,
      image3 TEXT,
      color TEXT,
      seats INTEGER,
      horsepower INTEGER,
      type TEXT
    )
  `);

  try {
    const tableInfo = await db.all("PRAGMA table_info(cars)");
    const columnNames = tableInfo.map((col) => col.name);

    if (!columnNames.includes("color")) {
      await db.exec("ALTER TABLE cars ADD COLUMN color TEXT");
      console.log("Added color column to cars table");
    }

    if (!columnNames.includes("seats")) {
      await db.exec("ALTER TABLE cars ADD COLUMN seats INTEGER");
      console.log("Added seats column to cars table");
    }

    if (!columnNames.includes("horsepower")) {
      await db.exec("ALTER TABLE cars ADD COLUMN horsepower INTEGER");
      console.log("Added horsepower column to cars table");
    }

    if (!columnNames.includes("type")) {
      await db.exec("ALTER TABLE cars ADD COLUMN type TEXT");
      console.log("Added type column to cars table");
    }
  } catch (err) {
    console.error("Error checking/adding columns:", err);
  }

  const count = await db.get("SELECT COUNT(*) as count FROM cars");
  console.log(`Current cars in database: ${count.count}`);

  if (count.count === 0) {
    const sampleCars = [
      {
        brand: "Lamborghini",
        model: "Huracán",
        year: 2023,
        image1: "/images/lamborghini-1.jpg",
        image2: "/images/lamborghini-2.jpg",
        image3: "/images/lamborghini-3.jpg",
        color: "Gul",
        seats: 2,
        horsepower: 640,
        type: "Sport",
      },
      {
        brand: "Mercedes-Benz",
        model: "G63 AMG",
        year: 2023,
        image1: "/images/g63-1.jpg",
        image2: "/images/g63-2.jpg",
        image3: "/images/g63-3.jpg",
        color: "Svart",
        seats: 5,
        horsepower: 577,
        type: "SUV",
      },
      {
        brand: "Rolls-Royce",
        model: "Cullinan",
        year: 2023,
        image1: "/images/rolls-1.jpg",
        image2: "/images/rolls-2.jpg",
        image3: "/images/rolls-3.jpg",
        color: "Silver",
        seats: 5,
        horsepower: 563,
        type: "Luxury",
      },
    ];

    console.log("Adding sample cars to database...");

    await db.run("BEGIN TRANSACTION");

    const insert = await db.prepare(`
      INSERT INTO cars (brand, model, year, image1, image2, image3, color, seats, horsepower, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const car of sampleCars) {
      await insert.run(
        car.brand,
        car.model,
        car.year,
        car.image1,
        car.image2,
        car.image3,
        car.color,
        car.seats,
        car.horsepower,
        car.type
      );
    }

    await insert.finalize();
    await db.run("COMMIT");

    console.log("Sample car data inserted successfully");
  }

  return db;
}

async function setupRoutes(db) {
  app.get("/api/cars", async (req, res) => {
    try {
      const cars = await db.all(
        "SELECT id, brand, model, year, image1, image2, image3, color, seats, horsepower, type FROM cars"
      );
      console.log(`Returning ${cars.length} cars`);
      res.json(cars);
    } catch (err) {
      console.error("Error fetching cars:", err);
      res.status(500).json({ error: "Failed to fetch cars" });
    }
  });

  app.get("/api/cars/:id", async (req, res) => {
    try {
      const car = await db.get(
        "SELECT id, brand, model, year, image1, image2, image3, color, seats, horsepower, type FROM cars WHERE id = ?",
        req.params.id
      );

      if (!car) {
        return res.status(404).json({ error: "Car not found" });
      }

      res.json(car);
    } catch (err) {
      console.error("Error fetching car:", err);
      res.status(500).json({ error: "Failed to fetch car" });
    }
  });

  app.post("/api/cars", async (req, res) => {
    const {
      brand,
      model,
      year,
      image1,
      image2,
      image3,
      color,
      seats,
      horsepower,
      type,
    } = req.body;

    if (!brand || !model || !year || !image1) {
      return res.status(400).json({
        error: "Brand, model, year and at least one image are required",
      });
    }

    try {
      const result = await db.run(
        "INSERT INTO cars (brand, model, year, image1, image2, image3, color, seats, horsepower, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          brand,
          model,
          year,
          image1,
          image2 || null,
          image3 || null,
          color || null,
          seats || null,
          horsepower || null,
          type || "Luxury",
        ]
      );

      console.log(`New car added with ID: ${result.lastID}`);

      res.status(201).json({
        id: result.lastID,
        brand,
        model,
        year,
        image1,
        image2,
        image3,
        color,
        seats,
        horsepower,
        type,
      });
    } catch (err) {
      console.error("Error adding car:", err);
      res.status(500).json({ error: "Failed to add car" });
    }
  });

  app.post(
    "/api/cars/upload",
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        console.log("Received upload request", req.body);
        console.log("Files:", req.files);

        const { brand, model, year, color, seats, horsepower, type } = req.body;

        if (!brand || !model || !year) {
          return res.status(400).json({
            error: "Brand, model, and year are required",
          });
        }

        const imageUrls = {};

        if (req.files.image1) {
          const file = req.files.image1[0];
          imageUrls.image1 = `/uploads/${file.filename}`;
        } else if (req.body.image1_url) {
          imageUrls.image1 = req.body.image1_url;
        } else {
          return res.status(400).json({
            error: "At least one image is required",
          });
        }

        if (req.files.image2) {
          const file = req.files.image2[0];
          imageUrls.image2 = `/uploads/${file.filename}`;
        } else if (req.body.image2_url) {
          imageUrls.image2 = req.body.image2_url;
        }

        if (req.files.image3) {
          const file = req.files.image3[0];
          imageUrls.image3 = `/uploads/${file.filename}`;
        } else if (req.body.image3_url) {
          imageUrls.image3 = req.body.image3_url;
        }

        const result = await db.run(
          "INSERT INTO cars (brand, model, year, image1, image2, image3, color, seats, horsepower, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            brand,
            model,
            year,
            imageUrls.image1,
            imageUrls.image2 || null,
            imageUrls.image3 || null,
            color || null,
            seats ? parseInt(seats) : null,
            horsepower ? parseInt(horsepower) : null,
            type || "Luxury",
          ]
        );

        console.log(`New car added with ID: ${result.lastID}`);

        res.status(201).json({
          id: result.lastID,
          brand,
          model,
          year,
          ...imageUrls,
          color,
          seats: seats ? parseInt(seats) : null,
          horsepower: horsepower ? parseInt(horsepower) : null,
          type,
        });
      } catch (error) {
        console.error("Error uploading car:", error);
        res
          .status(500)
          .json({ error: "Failed to upload car: " + error.message });
      }
    }
  );

  app.put("/api/cars/:id", async (req, res) => {
    const { id } = req.params;
    const {
      brand,
      model,
      year,
      image1,
      image2,
      image3,
      color,
      seats,
      horsepower,
      type,
    } = req.body;

    if (!brand || !model || !year || !image1) {
      return res.status(400).json({
        error: "Brand, model, year and at least one image are required",
      });
    }

    try {
      const result = await db.run(
        "UPDATE cars SET brand = ?, model = ?, year = ?, image1 = ?, image2 = ?, image3 = ?, color = ?, seats = ?, horsepower = ?, type = ? WHERE id = ?",
        [
          brand,
          model,
          year,
          image1,
          image2 || null,
          image3 || null,
          color || null,
          seats || null,
          horsepower || null,
          type || "Luxury",
          id,
        ]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Car not found" });
      }

      res.json({
        id: parseInt(id),
        brand,
        model,
        year,
        image1,
        image2,
        image3,
        color,
        seats,
        horsepower,
        type,
      });
    } catch (err) {
      console.error("Error updating car:", err);
      res.status(500).json({ error: "Failed to update car" });
    }
  });

  app.put("/api/cars/:id/properties", async (req, res) => {
    try {
      const { id } = req.params;
      const { brand, model, year, color, seats, horsepower, type } = req.body;

      console.log(`Updating car properties for ID ${id}:`, req.body);

      if (!brand || !model || !year) {
        return res.status(400).json({
          error: "Brand, model, and year are required",
        });
      }

      const seatsValue = seats !== undefined ? parseInt(seats) : null;
      const horsepowerValue =
        horsepower !== undefined ? parseInt(horsepower) : null;
      const yearValue = parseInt(year);

      const result = await db.run(
        "UPDATE cars SET brand = ?, model = ?, year = ?, color = ?, seats = ?, horsepower = ?, type = ? WHERE id = ?",
        [
          brand,
          model,
          yearValue,
          color || null,
          seatsValue,
          horsepowerValue,
          type || "Luxury",
          id,
        ]
      );

      if (result.changes === 0) {
        return res.status(404).json({ error: "Car not found" });
      }

      const updatedCar = await db.get(
        "SELECT id, brand, model, year, image1, image2, image3, color, seats, horsepower, type FROM cars WHERE id = ?",
        id
      );

      console.log("Updated car data:", updatedCar);

      res.json(updatedCar);
    } catch (error) {
      console.error("Error updating car properties:", error);
      res.status(500).json({ error: "Failed to update car: " + error.message });
    }
  });

  app.put(
    "/api/cars/:id/upload",
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        console.log("Received update request with body:", req.body);
        console.log("Files for update:", req.files);

        const { id } = req.params;
        const { brand, model, year, color, seats, horsepower, type } = req.body;

        console.log(
          `Updating car ${id} with color: ${color}, seats: ${seats}, horsepower: ${horsepower}, type: ${type}`
        );

        if (!brand || !model || !year) {
          return res.status(400).json({
            error: "Brand, model, and year are required",
          });
        }

        const imageUrls = {};

        if (req.files.image1) {
          const file = req.files.image1[0];
          imageUrls.image1 = `/uploads/${file.filename}`;
        } else if (req.body.image1_url) {
          imageUrls.image1 = req.body.image1_url;
        } else {
          return res.status(400).json({
            error: "At least one image is required",
          });
        }

        if (req.files.image2) {
          const file = req.files.image2[0];
          imageUrls.image2 = `/uploads/${file.filename}`;
        } else if (req.body.image2_url) {
          imageUrls.image2 = req.body.image2_url;
        }

        if (req.files.image3) {
          const file = req.files.image3[0];
          imageUrls.image3 = `/uploads/${file.filename}`;
        } else if (req.body.image3_url) {
          imageUrls.image3 = req.body.image3_url;
        }

        const seatsValue = seats !== undefined ? parseInt(seats) : null;
        const horsepowerValue =
          horsepower !== undefined ? parseInt(horsepower) : null;

        console.log("Ready to update with values:", {
          brand,
          model,
          year,
          images: imageUrls,
          color: color || null,
          seats: seatsValue,
          horsepower: horsepowerValue,
          type: type || "Luxury",
        });

        const result = await db.run(
          "UPDATE cars SET brand = ?, model = ?, year = ?, image1 = ?, image2 = ?, image3 = ?, color = ?, seats = ?, horsepower = ?, type = ? WHERE id = ?",
          [
            brand,
            model,
            year,
            imageUrls.image1,
            imageUrls.image2 || null,
            imageUrls.image3 || null,
            color || null,
            seatsValue,
            horsepowerValue,
            type || "Luxury",
            id,
          ]
        );

        if (result.changes === 0) {
          return res.status(404).json({ error: "Car not found" });
        }

        console.log(`Car with ID ${id} updated successfully`);

        const updatedCar = await db.get(
          "SELECT id, brand, model, year, image1, image2, image3, color, seats, horsepower, type FROM cars WHERE id = ?",
          id
        );

        console.log("Updated car data:", updatedCar);

        res.json({
          id: parseInt(id),
          brand,
          model,
          year,
          ...imageUrls,
          color: color || null,
          seats: seatsValue,
          horsepower: horsepowerValue,
          type: type || "Luxury",
        });
      } catch (error) {
        console.error("Error updating car:", error);
        res
          .status(500)
          .json({ error: "Failed to update car: " + error.message });
      }
    }
  );

  app.delete("/api/cars/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.run("DELETE FROM cars WHERE id = ?", id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Car not found" });
      }

      res.json({ message: "Car deleted successfully" });
    } catch (err) {
      console.error("Error deleting car:", err);
      res.status(500).json({ error: "Failed to delete car" });
    }
  });

  // Skapa en enkel hälsokoll-endpoint för Render
  app.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // Lägg till denna route sist, efter alla API-routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
  });
}

async function startServer() {
  try {
    const db = await setupDatabase();
    await setupRoutes(db);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/cars`);
      console.log(
        `Database connected: ${path.join(__dirname, "db", "Cars.db")}`
      );
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
}

startServer();
