import { ApiError } from "../utils/ApiError.js";

export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  if (error.name === "MulterError") {
    res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Uploaded file is too large. Maximum size is 15MB."
          : "Upload failed."
    });
    return;
  }

  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid authentication token."
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Authentication token expired."
    });
    return;
  }

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong.",
    details: error.details || null,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined
  });
};
