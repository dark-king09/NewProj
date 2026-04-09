import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { env } from "./config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.nodeEnv === "development") {
      callback(null, true);
      return;
    }

    if (env.clientUrls.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Request origin is not allowed by CORS."));
  },
  credentials: false
};

app.use(
  cors(corsOptions)
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development") {
  app.use(morgan("dev"));
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Rural Education and Skill Development API is healthy."
  });
});

app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);
