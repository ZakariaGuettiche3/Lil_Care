import { randomUUID } from "crypto";
import { numeric, pgSchema, smallint, uuid } from "drizzle-orm/pg-core";
import {
  boolean,
  date,
  jsonb,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";

import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
export const auth = pgSchema("auth");

import { customType } from "drizzle-orm/pg-core";
import { User } from "@supabase/supabase-js";
// import { EducationSchedul, NotificationData } from "./types";
import { educators, parents } from "./modules/users";
import { usersAuth } from "./modules/users";
import { events, invoices, messages, services } from "./modules";

const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "jsonb";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
  })(name);





type UserMetaData = User["user_metadata"];

export type NotificationData =
  | {
      message: typeof messages.$inferSelect;
    }
  | {
      invoice: typeof invoices.$inferSelect;
    }
  | {
      event: typeof events.$inferSelect;
    };

export const notifications = pgTable("notification", {
  id: serial("id").primaryKey().notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersAuth.id),
  photo: text("photo"),
  message: varchar("message", { length: 255 }).notNull(),
  type: varchar("type", {
    length: 20,
    enum: ["message", "event_created", "invoice_created", "invoice_paid"],
  }).notNull(),
  created_at: serial("created_at").notNull(),
  metadata: customJsonb("metadata").$type<NotificationData>(),
  readed: boolean("readed").default(false),
});

export * from "./modules";
