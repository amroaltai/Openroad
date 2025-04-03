// server.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Nytt
import { initDatabase } from "./db/database.js";
import carsRoutes from "./routes/cars.js";
import authRoutes from "./routes/auth.js"; // Nytt
import fs from "fs";

// Load environment variables
dotenv.config();

// Set up dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", true); // Lägg till denna rad för Render-kompatibilitet
const PORT = process.env.PORT || 5000;

// CORS configuration - behåller dina befintliga inställningar
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://openroad.onrender.com",
      /\.onrender\.com$/, // Allows all Render subdomains
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // VIKTIGT: För att hantera form data
app.use(cookieParser()); // Nytt: för att hantera cookies

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

// Serve static files from public folder for backward compatibility
app.use(express.static(path.join(__dirname, "..", "public")));

// Skapa temp-uploads mapp om den inte finns
const tempUploadsDir = path.join(__dirname, "temp-uploads");
if (!fs.existsSync(tempUploadsDir)) {
  fs.mkdirSync(tempUploadsDir, { recursive: true });
  console.log("Created temp-uploads directory");
}

// API routes
app.use("/api/cars", carsRoutes);
app.use("/api/auth", authRoutes); // Nytt: route för autentisering

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Explicit route for robots.txt
app.get("/robots.txt", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "robots.txt"));
});

// Explicit route for sitemap.xml
app.get("/sitemap.xml", (req, res) => {
  res.contentType("application/xml");
  res.sendFile(path.join(__dirname, "..", "client", "dist", "sitemap.xml"));
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// Initialize the database then start the server
async function startServer() {
  try {
    // Initialize database
    const dbInitialized = await initDatabase();

    if (!dbInitialized) {
      console.error(
        "Failed to initialize database. Server will start but functionality may be limited."
      );
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/cars`);
      console.log(
        `Using PostgreSQL database: ${
          process.env.DATABASE_URL?.split("@")[1] || "Unknown"
        }`
      );
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
}

startServer();
