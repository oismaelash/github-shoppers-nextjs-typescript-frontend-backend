import { defineConfig } from "prisma/config";

// Allow loading environment variables from .env file for local development
// but don't fail if .env is missing (e.g. in Docker)
try {
  await import("dotenv/config");
} catch (e) {
  // Config file not found or dotenv not installed - ignore
  console.log("dotenv not found");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? (() => {
      console.warn("Warning: DATABASE_URL is not defined in environment variables.");
      return "";
    })(),
  },
});
