import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Försäkra oss om att port är korrekt satt
const PORT = process.env.PORT || 10000;
process.env.PORT = PORT;

console.log(`Starting server on port ${PORT}...`);

// Starta server.js i en underprocess
const serverProcess = spawn("node", ["server/server.js"], {
  stdio: "inherit",
  env: process.env,
});

serverProcess.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});
