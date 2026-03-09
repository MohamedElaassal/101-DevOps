import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import { initDB } from "./db/connection";

import roadmapRoutes from "./routes/roadmap";
import insightsRoutes from "./routes/insights";
import toolboxRoutes from "./routes/toolbox";

// Set up the port
const PORT = process.env.PORT || 3000;

// Create Express app and router
const app = express();
const router = express.Router();

// Middleware: CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Routes
router.use("/journey", roadmapRoutes);
router.use("/wisdom", insightsRoutes);
router.use("/toolkit", toolboxRoutes);
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "DevOps HQ API is running!" });
});

app.use("/api", router);

// Retry helper for DB initialization
async function startWithRetry(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await initDB();
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
      return;
    } catch (err) {
      console.error(`DB init attempt ${i + 1}/${retries} failed:`, err);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  console.error("All DB init attempts failed. Exiting.");
  process.exit(1);
}

startWithRetry();
