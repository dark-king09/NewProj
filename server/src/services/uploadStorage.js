import path from "node:path";
import mongoose from "mongoose";

const bucketName = "uploads";

const getBucket = () => {
  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection is not ready for file storage.");
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName });
};

const createStoredFilename = (originalName) => {
  const extension = path.extname(originalName).toLowerCase();
  const baseName = originalName
    .replace(extension, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `${Date.now()}-${baseName || "upload"}${extension}`;
};

const cleanHeaderFilename = (filename) => filename.replace(/["\r\n]/g, "");

export const saveUploadedFile = (file) =>
  new Promise((resolve, reject) => {
    const bucket = getBucket();
    const filename = createStoredFilename(file.originalname);
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        originalName: file.originalname,
        contentType: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
      }
    });

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve({
        id: uploadStream.id,
        filename,
        contentType: file.mimetype,
        size: file.size
      });
    });

    uploadStream.end(file.buffer);
  });

export const streamUploadedFile = async (filename, res, next) => {
  const bucket = getBucket();
  const file = await bucket.find({ filename }).sort({ uploadDate: -1 }).limit(1).next();

  if (!file) {
    next();
    return;
  }

  const contentType = file.contentType || file.metadata?.contentType || "application/octet-stream";
  const displayName = cleanHeaderFilename(file.metadata?.originalName || file.filename);

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Length", file.length);
  res.setHeader("Content-Disposition", `inline; filename="${displayName}"`);

  const downloadStream = bucket.openDownloadStream(file._id);
  downloadStream.on("error", next);
  downloadStream.pipe(res);
};
