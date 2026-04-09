import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication required.");
  }

  if (!env.jwtSecret) {
    throw new ApiError(500, "JWT secret is not configured.");
  }

  const token = authorization.split(" ")[1];
  const payload = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(payload.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User session is no longer valid.");
  }

  req.user = user;
  next();
});

export const adminOnly = (req, _res, next) => {
  if (!req.user || req.user.role !== "admin") {
    next(new ApiError(403, "Admin access only."));
    return;
  }

  next();
};
