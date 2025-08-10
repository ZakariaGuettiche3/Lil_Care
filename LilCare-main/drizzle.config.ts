import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "@/lib/constant";

export default {
  dialect: "postgresql",
  schema: "./db/schema.ts",
  out: "./drizzle/",
  dbCredentials: {
    url: "postgresql://postgres.syjwhaddzvfiwuqkiwle:UUvR0HO1WqUY2MEk@aws-0-eu-north-1.pooler.supabase.com:5432/postgres",
    pool: {
      max: 10, // nombre max connexions
      idleTimeoutMillis: 3000000,
      connectionTimeoutMillis: 1000000,
    },
  },
} as Config;
