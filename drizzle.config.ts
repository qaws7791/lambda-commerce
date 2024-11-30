require("dotenv").config();

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "lambda/db/drizzle/migrations",
  schema: "lambda/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});
