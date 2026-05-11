import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  host: process.env.HOST || "0.0.0.0",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  mongoUri: process.env.MONGODB_URI || "",
  mongoUsername: process.env.MONGODB_USERNAME || "",
  mongoPassword: process.env.MONGODB_PASSWORD || "",
  mongoClusterUrl: process.env.MONGODB_CLUSTER_URL || "",
  mongoDatabase: process.env.MONGODB_DATABASE || "rural-education-platform",
  mongoDnsServers: (process.env.MONGODB_DNS_SERVERS || "")
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean),
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  adminSeedName: process.env.ADMIN_SEED_NAME || "Platform Admin",
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL || "",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD || ""
};
