import { connectDatabase } from "../config/db.js";
import { Program } from "../models/Program.js";
import { Resource } from "../models/Resource.js";
import { Story } from "../models/Story.js";

const syncOne = async (Model, slugs, updates) => {
  const document = await Model.findOne({ slug: { $in: slugs } });

  if (!document) {
    return false;
  }

  Object.assign(document, updates);
  await document.save();
  return true;
};

const syncPlatformContent = async () => {
  await connectDatabase();

  const results = await Promise.all([
    syncOne(
      Program,
      ["village-learning-circles", "village-learning-and-skills-circles"],
      {
        title: "Village Learning and Skills Circles",
        summary:
          "After-school peer groups that keep students on track with reading, science, digital confidence, and practical life skills.",
        description:
          "Village Learning and Skills Circles bring trained mentors, low-cost learning kits, digital practice sessions, and weekly family check-ins into rural communities where academic and skill-building support is hard to access.",
        impactMetric: "1,200+ learners and trainees reached",
        focusAreas: ["Foundational literacy", "STEM exposure", "Problem solving"]
      }
    ),
    syncOne(
      Program,
      ["girls-forward-scholarship-desk"],
      {
        summary:
          "A guided scholarship and transition support program for girls moving from upper primary to secondary school and future skill pathways.",
        description:
          "This desk combines financial guidance, application help, transportation planning, career exposure, and community advocacy to keep girls progressing through school and into stronger future pathways."
      }
    ),
    syncOne(
      Program,
      ["teacher-resource-studio", "teacher-and-youth-skills-studio"],
      {
        title: "Teacher and Youth Skills Studio",
        summary:
          "Practical teaching tools, youth skill lab templates, and coaching for educators in low-resource settings.",
        description:
          "The studio supports teachers and facilitators with lesson packs, offline-friendly activities, digital exposure modules, and assessment tools designed for mixed-age classrooms and limited infrastructure.",
        audience: "Teachers, facilitators, and school leaders",
        format: "Resource packs, coaching, and youth skill labs",
        impactMetric: "320 educators and facilitators supported",
        focusAreas: ["Lesson design", "Skill labs", "Inclusive teaching"]
      }
    ),
    syncOne(
      Story,
      ["a-science-fair-built-from-local-materials"],
      {
        summary:
          "Students used farm tools, water jars, and bicycle parts to demonstrate physics, engineering ideas, and maker skills.",
        body:
          "By framing science through the materials students already knew, facilitators helped schools run hands-on exhibitions that felt relevant and achievable. Teachers now use the same approach in regular lessons and local skill clubs."
      }
    ),
    syncOne(
      Resource,
      ["rural-school-readiness-toolkit"],
      {
        summary:
          "A practical checklist for schools preparing stronger academic, skilling, and family-support systems."
      }
    ),
    syncOne(
      Resource,
      [
        "scholarship-planning-guide-for-families",
        "scholarship-and-career-pathways-guide-for-families"
      ],
      {
        title: "Scholarship and Career Pathways Guide for Families",
        summary:
          "Simple guidance for caregivers navigating application steps, deadlines, document readiness, and early career exploration."
      }
    ),
    syncOne(
      Resource,
      [
        "offline-activity-pack-for-mixed-age-classrooms",
        "offline-skills-activity-pack-for-mixed-age-classrooms"
      ],
      {
        title: "Offline Skills Activity Pack for Mixed-Age Classrooms",
        summary:
          "Teacher-ready classroom and skill-building activities designed for low-resource, multi-grade environments."
      }
    )
  ]);

  console.log(`Platform content sync complete. Updated ${results.filter(Boolean).length} records.`);
};

syncPlatformContent()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to sync platform content:", error.message);
    process.exit(1);
  });
