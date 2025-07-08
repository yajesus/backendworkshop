import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes";
import workshopRoutes from "./routes/workshop.routes";
import bookingRoutes from "./routes/booking.routes";
import statsRoutes from "./routes/stats.routes";
import { errorHandler } from "./utils/errorHandler";

dotenv.config();
const app = express();

const prisma = new PrismaClient();

async function connectToDB() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to Neon PostgreSQL via Prisma");
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1); // Exit if DB fails
  }
}

connectToDB();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/api", authRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/stats", statsRoutes);

// 404 handler for unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  });
});

// Global error handler - must be last
app.use(errorHandler);

export default app;
