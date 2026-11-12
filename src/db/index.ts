import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/datascope";

// Disable prefetch as it is not supported for "Transaction" pool mode (e.g. Supabase, Neon)
export const client = postgres(connectionString, {
  prepare: false,
  max: 20, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

