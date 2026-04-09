import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    audience: {
      type: String,
      required: true,
      trim: true
    },
    format: {
      type: String,
      required: true,
      trim: true
    },
    impactMetric: {
      type: String,
      required: true,
      trim: true
    },
    focusAreas: {
      type: [String],
      default: []
    },
    imageUrl: {
      type: String,
      default: ""
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published"
    }
  },
  {
    timestamps: true
  }
);

export const Program = mongoose.model("Program", programSchema);
