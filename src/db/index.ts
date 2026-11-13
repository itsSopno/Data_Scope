import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { parse } from "pg-connection-string";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres.tmwywnxmonmzejiuompl:zxc1122Edzxc@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

const config = parse(connectionString);

const isLocalhost = config.host === "localhost" || config.host === "127.0.0.1";

export const pool = new Pool({
  user: config.user || "postgres.tmwywnxmonmzejiuompl",
  password: config.password ? String(config.password) : "zxc1122Edzxc",
  host: config.host || "aws-0-ap-southeast-1.pooler.supabase.com",
  port: config.port ? Number(config.port) : 5432,
  database: config.database || "postgres",
  ssl: isLocalhost ? false : { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });
