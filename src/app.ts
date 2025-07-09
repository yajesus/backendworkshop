import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes";
import workshopRoutes from "./routes/workshop.routes";
import bookingRoutes from "./routes/booking.routes";
import statsRoutes from "./routes/stats.routes";
import { errorHandler } from "./utils/errorHandler";
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();

// Rate limiting: 100 requests per hour per IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    error: {
      message: 'Too many requests from this IP, please try again after an hour',
      statusCode: 429
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

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
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
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
