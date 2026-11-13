import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres.tmwywnxmonmzejiuompl:zxc1122Edzxc@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle({ client: pool, schema });
