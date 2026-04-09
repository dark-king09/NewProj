import { Router } from "express";
import {
  getProgramBySlug,
  getPrograms,
  getPublicContent,
  getResources,
  getStories,
  getStoryBySlug,
  submitContactMessage
} from "../controllers/publicController.js";

const router = Router();

router.get("/content", getPublicContent);
router.get("/programs", getPrograms);
router.get("/programs/:slug", getProgramBySlug);
router.get("/stories", getStories);
router.get("/stories/:slug", getStoryBySlug);
router.get("/resources", getResources);
router.post("/contact", submitContactMessage);

export default router;
