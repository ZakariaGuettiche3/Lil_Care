import {
    serial,
    varchar,
    date,
    text,
    timestamp,
    customType,
    PgTextConfig,
    ConvertCustomConfig, PgCustomColumnBuilder
} from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { sections } from "../schema";
import { parents } from "./users";




export const children = pgTable("children", {
    id : serial("id").primaryKey().unique().notNull(),
    firstName : varchar("firstName", {length: 100}).notNull(),
    lastName : varchar("lastName", {length: 100}).notNull(),
    gender : varchar("gender", {length: 6, enum: ["Male", "Female"]}).notNull(),
    birthDate : date("birthDate").notNull(),
    section : serial("section").notNull().references(() => sections.id),
    photo : text("photo"),
    parent :  serial("parentId").notNull().references(() => parents.cardId)
  })

export const ChildLocation = pgTable('child_geolocation', {
    id: serial('id').primaryKey(),
    childId: serial('child_id').notNull().references(() => children.id),
    sectionId: serial('section_id').notNull().references(() =>sections.id), // New column for device ID
    latitude: text('latitude').notNull(),
    longitude: text('longitude').notNull(),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    accuracy: text('accuracy').notNull(),
    speed: text('speed'),
    altitude: text('altitude')
  });
  export const MedicalRecord = pgTable('medical_record', {
    id: serial('id').primaryKey().notNull(),
    drugs: text('drugs').array().notNull(),
    allergies: text('allergies').array().notNull(),
    specificCare: text('specific_care').notNull(),
    previousDiseases: text('previous_diseases').array().notNull(),
    healthNotice: text('health_notice').notNull(),
    specialDiet: text('special_diet').notNull(),
    bloodGroup: text('blood_group', ).notNull(), // Assuming blood group is stored as text
    otherNotice: text('other_notice').notNull(),
    childId: serial('child_id').references(() => children.id)
  });
  
  
  export const PsychologicalProfile = pgTable('psychological_profile', {
    id: serial('id').primaryKey(),
    behavioralObservations: text('behavioral_observations'),
    mentalState: text('mental_state'),
    emotionalState: text('emotional_state'),
    personalityCharacteristics: text('personality_characteristics'),
    childId: serial('child_id').references(() => children.id)
  });
  