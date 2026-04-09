import { ContactMessage } from "../models/ContactMessage.js";
import { Program } from "../models/Program.js";
import { Resource } from "../models/Resource.js";
import { Story } from "../models/Story.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const publishedFilter = { status: "published" };

const calculateStats = (_programs, _stories, resources) => [
  {
    label: "Learners and trainees",
    value: "12,500+"
  },
  {
    label: "Rural communities",
    value: "48"
  },
  {
    label: "Teacher and mentor partners",
    value: "320"
  },
  {
    label: "Resource downloads",
    value: `${resources.length * 125 + 180}+`
  }
];

export const getPublicContent = asyncHandler(async (_req, res) => {
  const [programs, stories, resources] = await Promise.all([
    Program.find(publishedFilter).sort({ featured: -1, createdAt: -1 }),
    Story.find(publishedFilter).sort({ featured: -1, createdAt: -1 }),
    Resource.find(publishedFilter).sort({ createdAt: -1 })
  ]);

  res.status(200).json({
    success: true,
    data: {
      programs,
      stories,
      resources,
      featuredStory: stories.find((story) => story.featured) || stories[0] || null,
      stats: calculateStats(programs, stories, resources)
    }
  });
});

export const getPrograms = asyncHandler(async (_req, res) => {
  const programs = await Program.find(publishedFilter).sort({ featured: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: programs });
});

export const getProgramBySlug = asyncHandler(async (req, res) => {
  const program = await Program.findOne({ slug: req.params.slug, ...publishedFilter });

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  res.status(200).json({ success: true, data: program });
});

export const getStories = asyncHandler(async (_req, res) => {
  const stories = await Story.find(publishedFilter).sort({ featured: -1, createdAt: -1 });
  res.status(200).json({ success: true, data: stories });
});

export const getStoryBySlug = asyncHandler(async (req, res) => {
  const story = await Story.findOne({ slug: req.params.slug, ...publishedFilter });

  if (!story) {
    throw new ApiError(404, "Story not found.");
  }

  res.status(200).json({ success: true, data: story });
});

export const getResources = asyncHandler(async (_req, res) => {
  const resources = await Resource.find(publishedFilter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: resources });
});

export const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, organization, interestArea, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required.");
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    organization,
    interestArea,
    message
  });

  res.status(201).json({
    success: true,
    message: "Thank you. Your message has been received.",
    data: contactMessage
  });
});
