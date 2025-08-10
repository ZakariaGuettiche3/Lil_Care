import { customType, date, timestamp } from "drizzle-orm/pg-core";
import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
import { modules, sections, services } from ".";
import { PriceData } from "@/types";
import {datetime} from "drizzle-orm/mysql-core";

const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "jsonb";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
    fromDriver(value: string):TData {
      return JSON.parse(value);
    },
  })(name);

  export const schedules = pgTable("schedules", {
    id: serial("id").primaryKey().unique().notNull(),
    title: varchar("title", { length: 100 }).notNull(),
    start: timestamp("start").notNull(),
    end: timestamp("end").notNull(),
    description: text("description").notNull(),
    type: varchar("type", { length: 100, enum: ["education", "nutrition", "event"] }).notNull(),
    // Optional: add created_at and updated_at timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
  });
  

  export const educationalSchedule = pgTable("educational_schedules", {
    id: serial("id").primaryKey(),
    sectionId: serial("section_id").references(() => sections.id).notNull(),
    scheduleId: serial("schedule_id").references(() => schedules.id).notNull(),
    moduleId: serial("module_id").references(() => modules.id).notNull(),
    metadata: customJsonb("metadata"),
  });
  

export const nutritionSchedule = pgTable("nutrition", {
  id: serial("id").primaryKey().unique().notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  content: text("content").array().notNull(),
  description: text("description").notNull(),
  scheduleId: serial("scheduleId").references(() => schedules.id),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey().unique().notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description").notNull(),
  photo: text("photo").notNull().$default(() => ""),
  serviceId: text("service_id").references(() => services.id),  // Consistent naming
  metadata: customJsonb<{ prices: PriceData[], schedule: { start: Date, end: Date } }>("metadata"),
  scheduleId: serial("schedule_id").references(() => schedules.id).notNull(),
});

