import { streamUploadedFile } from "../services/uploadStorage.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const serveUploadedAsset = asyncHandler(async (req, res, next) => {
  await streamUploadedFile(req.params.filename, res, next);
});
