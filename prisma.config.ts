// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma", // optional if it's the default path
  datasource: {
    url: process.env.DATABASE_URL,
  },
});