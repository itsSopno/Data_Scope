import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["public"],
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres.tmwywnxmonmzejiuompl:zxc1122Edzxc@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  },
  verbose: true,
});
