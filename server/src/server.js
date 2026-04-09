import os from "node:os";
import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { defaultPrograms, defaultResources, defaultStories } from "./data/seedContent.js";
import { Program } from "./models/Program.js";
import { Resource } from "./models/Resource.js";
import { Story } from "./models/Story.js";
import { User } from "./models/User.js";

const createSlug = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const getNetworkUrls = () => {
  const interfaces = os.networkInterfaces();

  return Object.values(interfaces)
    .flat()
    .filter(Boolean)
    .filter((details) => details.family === "IPv4" && !details.internal)
    .map((details) => `http://${details.address}:${env.port}`);
};

const seedAdminUser = async () => {
  if (!env.adminSeedEmail || !env.adminSeedPassword) {
    return;
  }

  const existingAdmin = await User.findOne({ email: env.adminSeedEmail.toLowerCase() });

  if (!existingAdmin) {
    await User.create({
      name: env.adminSeedName,
      email: env.adminSeedEmail.toLowerCase(),
      password: env.adminSeedPassword,
      role: "admin"
    });
  }
};

const seedContentCollections = async () => {
  const [programCount, storyCount, resourceCount] = await Promise.all([
    Program.countDocuments(),
    Story.countDocuments(),
    Resource.countDocuments()
  ]);

  if (programCount === 0) {
    await Program.insertMany(
      defaultPrograms.map((program) => ({
        ...program,
        slug: createSlug(program.title)
      }))
    );
  }

  if (storyCount === 0) {
    await Story.insertMany(
      defaultStories.map((story) => ({
        ...story,
        slug: createSlug(story.title)
      }))
    );
  }

  if (resourceCount === 0) {
    await Resource.insertMany(
      defaultResources.map((resource) => ({
        ...resource,
        slug: createSlug(resource.title)
      }))
    );
  }
};

const startServer = async () => {
  try {
    await connectDatabase();
    await seedAdminUser();
    await seedContentCollections();

    app.listen(env.port, env.host, () => {
      console.log(`Server listening on http://localhost:${env.port}`);

      getNetworkUrls().forEach((url) => {
        console.log(`Server also available on ${url}`);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
