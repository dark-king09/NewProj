import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "application/msword",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

const allowedExtensions = new Set([
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".pdf",
  ".png",
  ".ppt",
  ".pptx",
  ".webp"
]);

const fileFilter = (_req, file, callback) => {
  const extensionStart = file.originalname.lastIndexOf(".");
  const extension = extensionStart >= 0 ? file.originalname.slice(extensionStart).toLowerCase() : "";
  const isImage = file.mimetype.startsWith("image/");
  const isAllowedDocument = allowedMimeTypes.has(file.mimetype) || allowedExtensions.has(extension);

  if (!isImage && !isAllowedDocument) {
    callback(
      new ApiError(
        400,
        "Allowed uploads: images, PDF, DOC, DOCX, PPT, and PPTX files."
      )
    );
    return;
  }

  callback(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024
  }
});
