import { boolean, jsonb, numeric, pgSchema, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import {
    date,
  } from "drizzle-orm/pg-core";
import {customers, sections} from "./";
import { customType } from 'drizzle-orm/pg-core';
import { User } from "@supabase/supabase-js";
import { ParentData } from "@/types";

type UserMetaData = User["user_metadata"]


const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return "jsonb";
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
    
  })(name);


  const userJsonb = customJsonb("raw_user_meta_data")
  export const auth = pgSchema("auth");


  export const jobs = pgTable("jobs", {
    id : serial("id").primaryKey().unique().notNull(),
    name : varchar("name", {length: 100}).notNull(),
    salary : numeric("salary").notNull(),
    type :text("role").$type<"Monthly" | "Daily" | "Hour">(),
  
  })


export const educators = pgTable("educators", {
    cardId : serial("cardid").primaryKey().unique().notNull(),
    firstName : varchar("firstName", {length: 100}).notNull(),
    lastName : varchar("lastName", {length: 100}).notNull(),
    birthDate : date("birthDate").notNull(),
    phone :  varchar("phone").notNull(),
    section : serial("section").notNull().references(() => sections.id),
    userId : uuid("userId").notNull().references(() => usersAuth.id),
    job : serial("job").notNull().references(() => jobs.id),
    photo: text("photo").notNull().default(""),

})
  
  export const parents = pgTable("parents", {
    cardId : serial("cardid").primaryKey().unique().notNull(),
    firstName : varchar("firstName", {length: 100}).notNull(),
    lastName : varchar("lastName", {length: 100}).notNull(),
    birthDate : date("birthDate").notNull(),
    phone :  varchar("phone").notNull(),
    photo: text("photo").notNull().default(""),
    customerId : text("customer_id").notNull().references(() => customers.id),
    userId : uuid("userId").notNull().references(() => usersAuth.id)
  })

export const therapists = pgTable("therapists", {
    cardId: serial("cardId").primaryKey().unique().notNull(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    birthDate: date("birthDate").notNull(),
  photo: text("photo").notNull().default(""),

  phone: varchar("phone").notNull(),
    userId: uuid("userId").references(() => usersAuth.id),
    specialization: varchar("specialization", { length: 100 }).notNull().default("")
  });
  
  export const admins = pgTable("admins", {
    cardId: serial("cardId").primaryKey().unique().notNull(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    userId: uuid("userId").references(() => usersAuth.id),
    photo: text("photo").notNull().default(""),

  });
  
  export const psychologists = pgTable("psychologists", {
    cardId: serial("cardId").primaryKey().unique().notNull(),
    firstName: varchar("firstName", { length: 100 }).notNull().default(""),
    lastName: varchar("lastName", { length: 100 }).notNull().default(""),
    licenseNumber: varchar("licenseNumber", { length: 100 }).notNull().default(""),
    userId: uuid("userId").references(() => usersAuth.id),
    photo: text("photo").notNull().default(""),

  });
  
  export const accountants = pgTable("accountants", {
    cardId: serial("cardId").primaryKey().unique().notNull(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    certification: varchar("certification", { length: 100 }).notNull().default(""),
    userId: uuid("userId").references(() => usersAuth.id),
    photo: text("photo").notNull().default(""),

  });

  export const Preregistrations = pgTable("preregistration", {
    id: serial("id").primaryKey().unique().notNull(),
    parentEmail: varchar("parentEmail", { length: 255 }).unique().notNull(),
    parentPhone: varchar("parentPhone", { length: 12 }).unique().notNull(),
    parentFirstName: varchar("parentFirstName", { length: 50 }).notNull(),
    parentLastName: varchar("parentLastName", { length: 50 }).notNull(),
    childFirstName: varchar("childFirstName", { length: 100 }).notNull(),
    childLastName: varchar("childLastName", { length: 100 }).notNull(),
    childBirthDate: date("childBirthDate").notNull(),
    childGender: varchar("childGender", { length: 10, enum : ['Male', 'Female'] }),
    childSection: serial("childsection").notNull().references(() => sections.id),
    paid : boolean("paid").notNull().default(false),
    registrationDate: timestamp("registrationDate").defaultNow(),
    confirmed: boolean("confirmed").default(false)
  });
  export const usersAuth = auth.table("users", {
    instanceId: uuid("instance_id"),
    id: uuid("id").primaryKey().notNull(),
    aud: varchar("aud", { length: 255 }),
    role: varchar("role", { length: 255 }),
    email: varchar("email", { length: 255 }),
    encryptedPassword: varchar("encrypted_password", { length: 255 }),
    emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true, mode: 'string' }),
    invitedAt: timestamp("invited_at", { withTimezone: true, mode: 'string' }),
    confirmationToken: varchar("confirmation_token", { length: 255 }),
    confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true, mode: 'string' }),
    recoveryToken: varchar("recovery_token", { length: 255 }),
    recoverySentAt: timestamp("recovery_sent_at", { withTimezone: true, mode: 'string' }),
    emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
    emailChange: varchar("email_change", { length: 255 }),
    emailChangeSentAt: timestamp("email_change_sent_at", { withTimezone: true, mode: 'string' }),
    lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true, mode: 'string' }),
    rawAppMetaData: jsonb("raw_app_meta_data"),
    rawUserMetaData: userJsonb,
    isSuperAdmin: boolean("is_super_admin"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
    phone: text("phone").default(""),
    phoneConfirmedAt: timestamp("phone_confirmed_at", { withTimezone: true, mode: 'string' }),
    phoneChange: text("phone_change").default(''),
    phoneChangeToken: varchar("phone_change_token", { length: 255 }).default(''),
    phoneChangeSentAt: timestamp("phone_change_sent_at", { withTimezone: true, mode: 'string' }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true, mode: 'string' }),
    emailChangeTokenCurrent: varchar("email_change_token_current", { length: 255 }).default(''),
    emailChangeConfirmStatus: smallint("email_change_confirm_status").default(0),
    bannedUntil: timestamp("banned_until", { withTimezone: true, mode: 'string' }),
    reauthenticationToken: varchar("reauthentication_token", { length: 255 }).default(''),
    reauthenticationSentAt: timestamp("reauthentication_sent_at", { withTimezone: true, mode: 'string' }),
    isSsoUser: boolean("is_sso_user").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: 'string' }),
    isAnonymous: boolean("is_anonymous").default(false).notNull(),
  });