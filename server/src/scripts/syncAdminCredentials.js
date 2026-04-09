import { connectDatabase } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

const syncAdminCredentials = async () => {
  if (!env.adminSeedEmail || !env.adminSeedPassword) {
    throw new Error("ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD are required.");
  }

  await connectDatabase();

  const normalizedEmail = env.adminSeedEmail.toLowerCase();

  let admin =
    (await User.findOne({ email: normalizedEmail }).select("+password")) ||
    (await User.findOne({ role: "admin" }).sort({ createdAt: 1 }).select("+password"));

  if (!admin) {
    admin = new User({
      name: env.adminSeedName,
      email: normalizedEmail,
      password: env.adminSeedPassword,
      role: "admin"
    });
  } else {
    admin.name = env.adminSeedName;
    admin.email = normalizedEmail;
    admin.password = env.adminSeedPassword;
    admin.role = "admin";
  }

  await admin.save();

  console.log(`Admin credentials synced for ${normalizedEmail}`);
};

syncAdminCredentials()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to sync admin credentials:", error.message);
    process.exit(1);
  });
