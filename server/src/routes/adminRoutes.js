import { Router } from "express";
import {
  createProgram,
  createResource,
  createStory,
  deleteProgram,
  deleteResource,
  deleteStory,
  getAdminDashboard,
  updateMessageStatus,
  updateProgram,
  updateResource,
  updateStory,
  uploadAsset
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/dashboard", getAdminDashboard);
router.post("/uploads", upload.single("file"), uploadAsset);

router.post("/programs", createProgram);
router.put("/programs/:id", updateProgram);
router.delete("/programs/:id", deleteProgram);

router.post("/stories", createStory);
router.put("/stories/:id", updateStory);
router.delete("/stories/:id", deleteStory);

router.post("/resources", createResource);
router.put("/resources/:id", updateResource);
router.delete("/resources/:id", deleteResource);

router.patch("/messages/:id", updateMessageStatus);

export default router;
