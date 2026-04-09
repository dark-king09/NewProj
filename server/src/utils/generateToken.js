import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (payload) => {
  if (!env.jwtSecret) {
    throw new Error("JWT_SECRET is missing from the server environment.");
  }

  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};
