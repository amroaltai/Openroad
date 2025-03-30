import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Serva statiska filer från client/dist
app.use(express.static(path.join(__dirname, "client", "dist")));

// En enkel API-endpoint för att visa att servern fungerar
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running in Render environment",
  });
});

// Dummy API för bilar
app.get("/api/cars", (req, res) => {
  const dummyCars = [
    {
      id: 1,
      brand: "Lamborghini",
      model: "Huracán",
      year: 2023,
      image1: "/images/lamborghini-1.jpg",
      color: "Gul",
      seats: 2,
      horsepower: 640,
      type: "Sport",
    },
    {
      id: 2,
      brand: "Mercedes-Benz",
      model: "G63 AMG",
      year: 2023,
      image1: "/images/g63-1.jpg",
      color: "Svart",
      seats: 5,
      horsepower: 577,
      type: "SUV",
    },
  ];
  res.json(dummyCars);
});

// Catch-all route för client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the app`);
});
