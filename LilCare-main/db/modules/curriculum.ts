import {
  boolean,
  customType,
  date,
  jsonb,
  primaryKey,
  timestamp,
} from "drizzle-orm/pg-core";

import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
import { children, services } from "../schema";
import { educators } from "./users";
import { PriceData } from "@/types";
import { metadata } from "@/app/layout";

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

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  createdAt: date("created_at").notNull(),
  photo: text("photo").notNull(),
  metadata: customJsonb<any>("data"),
});

export const seasons = pgTable("seasons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
});

export const section_modules = pgTable(
  "section_modules",
  {
    section: serial("sectionId").references(() => sections.id),
    moduleId: serial("moduleId").references(() => modules.id),
    data: jsonb("data"),
  },
  (t) => ({ pk: primaryKey({ columns: [t.section, t.moduleId] }) })
);
// Define the exams table with a season field to associate exams with seasons
export const exams = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  date: date("date").notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  score: serial("score").notNull(),
  seasonId: serial("seasonId").references(() => seasons.id),
  childId: serial("childId").references(() => children.id),
});// Define the exams table to store information about exams


// Define the notes table to store notes related to children and educators
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  date: date("date").notNull(),
  childId: serial("childId").references(() => children.id),
  educatorId: serial("educatorId").references(() => educators.cardId),
});


export const sections = pgTable("sections", {
  id : serial("id").primaryKey().unique().notNull(),
  name : varchar("name", {length: 100}).notNull(),
  age : serial("age").notNull(),
  description : text("description").notNull(),
  photo : text("photo").notNull().$default(()=>("")),
  seats :  serial("seats").notNull(),
  available : boolean("available").notNull().default(true),
  service: text("service").notNull().references(() => services.id),
  metadata: customJsonb<{prices : PriceData[]}>("metadata")
})