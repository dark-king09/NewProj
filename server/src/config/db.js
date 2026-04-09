import mongoose from "mongoose";
import { env } from "./env.js";

const buildMongoUri = () => {
  if (env.mongoUri) {
    return env.mongoUri;
  }

  if (
    env.mongoUsername &&
    env.mongoPassword &&
    env.mongoClusterUrl &&
    env.mongoDatabase
  ) {
    return `mongodb+srv://${encodeURIComponent(env.mongoUsername)}:${encodeURIComponent(
      env.mongoPassword
    )}@${env.mongoClusterUrl}/${env.mongoDatabase}?retryWrites=true&w=majority&appName=RuralSkillsPlatform`;
  }

  throw new Error(
    "MongoDB Atlas configuration is incomplete. Add MONGODB_URI or the split Atlas credentials in server/.env."
  );
};

export const connectDatabase = async () => {
  const uri = buildMongoUri();
  await mongoose.connect(uri);
  return mongoose.connection;
};
