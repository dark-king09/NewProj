import slugify from "slugify";
import { ContactMessage } from "../models/ContactMessage.js";
import { Program } from "../models/Program.js";
import { Resource } from "../models/Resource.js";
import { Story } from "../models/Story.js";
import { saveUploadedFile } from "../services/uploadStorage.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createUniqueSlug = async (Model, title, id = null) => {
  const baseSlug = slugify(title, { lower: true, strict: true, trim: true });
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await Model.findOne({
      slug: candidate,
      ...(id ? { _id: { $ne: id } } : {})
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const validateRequiredFields = (fields, body) => {
  const missing = fields.filter((field) => !body[field]);

  if (missing.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missing.join(", ")}.`);
  }
};

export const getAdminDashboard = asyncHandler(async (_req, res) => {
  const [programs, stories, resources, messages] = await Promise.all([
    Program.find().sort({ createdAt: -1 }),
    Story.find().sort({ createdAt: -1 }),
    Resource.find().sort({ createdAt: -1 }),
    ContactMessage.find().sort({ createdAt: -1 })
  ]);

  res.status(200).json({
    success: true,
    data: {
      programs,
      stories,
      resources,
      messages
    }
  });
});

export const uploadAsset = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded.");
  }

  const storedFile = await saveUploadedFile(req.file);

  res.status(201).json({
    success: true,
    message: "Asset uploaded successfully.",
    data: {
      fileName: storedFile.filename,
      url: `/uploads/${storedFile.filename}`
    }
  });
});

export const createProgram = asyncHandler(async (req, res) => {
  validateRequiredFields(
    ["title", "summary", "description", "location", "audience", "format", "impactMetric"],
    req.body
  );

  const slug = await createUniqueSlug(Program, req.body.title);
  const program = await Program.create({
    ...req.body,
    slug,
    focusAreas: normalizeList(req.body.focusAreas)
  });

  res.status(201).json({ success: true, data: program });
});

export const updateProgram = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  const updates = {
    ...req.body,
    focusAreas: normalizeList(req.body.focusAreas)
  };

  if (req.body.title && req.body.title !== program.title) {
    updates.slug = await createUniqueSlug(Program, req.body.title, program._id);
  }

  const updatedProgram = await Program.findByIdAndUpdate(program._id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: updatedProgram });
});

export const deleteProgram = asyncHandler(async (req, res) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    throw new ApiError(404, "Program not found.");
  }

  await program.deleteOne();
  res.status(200).json({ success: true, message: "Program deleted." });
});

export const createStory = asyncHandler(async (req, res) => {
  validateRequiredFields(
    ["title", "summary", "storyteller", "location", "quote", "body"],
    req.body
  );

  const slug = await createUniqueSlug(Story, req.body.title);
  const story = await Story.create({
    ...req.body,
    slug,
    tags: normalizeList(req.body.tags)
  });

  res.status(201).json({ success: true, data: story });
});

export const updateStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new ApiError(404, "Story not found.");
  }

  const updates = {
    ...req.body,
    tags: normalizeList(req.body.tags)
  };

  if (req.body.title && req.body.title !== story.title) {
    updates.slug = await createUniqueSlug(Story, req.body.title, story._id);
  }

  const updatedStory = await Story.findByIdAndUpdate(story._id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: updatedStory });
});

export const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);

  if (!story) {
    throw new ApiError(404, "Story not found.");
  }

  await story.deleteOne();
  res.status(200).json({ success: true, message: "Story deleted." });
});

export const createResource = asyncHandler(async (req, res) => {
  validateRequiredFields(["title", "summary", "category", "url", "ctaLabel"], req.body);

  const slug = await createUniqueSlug(Resource, req.body.title);
  const resource = await Resource.create({
    ...req.body,
    slug
  });

  res.status(201).json({ success: true, data: resource });
});

export const updateResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    throw new ApiError(404, "Resource not found.");
  }

  const updates = { ...req.body };

  if (req.body.title && req.body.title !== resource.title) {
    updates.slug = await createUniqueSlug(Resource, req.body.title, resource._id);
  }

  const updatedResource = await Resource.findByIdAndUpdate(resource._id, updates, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: updatedResource });
});

export const deleteResource = asyncHandler(async (req, res) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    throw new ApiError(404, "Resource not found.");
  }

  await resource.deleteOne();
  res.status(200).json({ success: true, message: "Resource deleted." });
});

export const updateMessageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["unread", "reviewed", "archived"].includes(status)) {
    throw new ApiError(400, "Invalid message status.");
  }

  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!message) {
    throw new ApiError(404, "Message not found.");
  }

  res.status(200).json({ success: true, data: message });
});
