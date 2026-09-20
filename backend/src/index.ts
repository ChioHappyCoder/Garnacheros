import "./types.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/clerk-sdk-node";
import { initDb } from "./db/db.js";
import { createTables } from "./db/schema.js";
import spotsRouter from "./routes/spots.js";
import reviewsRouter from "./routes/reviews.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

app.use(clerkMiddleware());

app.use("/api/spots", spotsRouter);
app.use("/api/reviews", reviewsRouter);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    await initDb();
    await createTables();
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

start();
