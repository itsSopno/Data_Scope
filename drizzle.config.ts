import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://postgres.gnlxsabowfwpveymkspi:zxc5566ed@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres",
    ssl: { rejectUnauthorized: false },
  },
  verbose: true,
});
