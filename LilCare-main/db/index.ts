import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from './schema'
import {DATABASE_URL} from "@/lib/constant";





const pgClient = postgres(DATABASE_URL)
export const DB  = drizzle(pgClient, {schema : schema });
declare global {
    var db : PostgresJsDatabase<typeof schema> | undefined;
    var window : Window & typeof globalThis
    
  }
  
  export const db = globalThis.db || DB ;
  
  if (process.env.NODE_ENV !== "production") globalThis.db = db;
  
  
