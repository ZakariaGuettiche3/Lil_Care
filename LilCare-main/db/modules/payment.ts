import {
  customType,
    date,
    uuid,
  } from "drizzle-orm/pg-core";
  
  import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core";
import { usersAuth } from "./users";
import { metadata } from "@/app/layout";
import { CustomerData, PriceData, ServiceData } from "@/types";
import { Images } from "lucide-react";


const customJsonb = <TData>(name: string) =>
  customType<{ data: TData; driverData: string }>({
    dataType() {
      return 'jsonb';
    },
    toDriver(value: TData): string {
      return JSON.stringify(value);
    },
    fromDriver(value: string): TData {
      return  JSON.parse(value);
    },
  })(name);

export const discounts = pgTable('discount', {
    id: serial('id').primaryKey().notNull(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    type: varchar('type', { length: 10, enum: ['percentage', 'amount'] }).notNull(),
    value: serial('value').notNull()
});



export const services = pgTable('services', {
    id: text('id').primaryKey().notNull().unique(),
    name: varchar('name', { length: 100 }).notNull().unique(),
    description: text('description').notNull(),
    dtype: varchar('dtype', { length: 10, enum: ['section', 'event', 'other'] }).notNull(),
    Images: text("images").array().notNull(),
    metadata: customJsonb<{prices: PriceData[]}>("metadata").notNull(),
});


export const customers = pgTable('customers', {
  id: text('id').primaryKey().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
});

export const price = pgTable('prices', {
    id: text('id').primaryKey().notNull().unique(),
    service_id: text('service_id').notNull().references(() => services.id),
    type: varchar('type', { length: 7, enum : ['Month', 'Year', 'Once', 'Quarter'] }).notNull(),
    price: serial('price').notNull(),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey().notNull(),
  date: date('date').notNull(),
  total_amount: serial('total_amount').notNull(),
  price : text('price').references(() => price.id),
  discount : serial('discount').references(() => discounts.id),
  status:varchar('status', { length: 7, enum : ["Paid", "Unpaid"] }).notNull().default("Unpaid"),
  receipent : text('receipent').references(() => customers.id),
  paid: serial('paid').notNull().$default(() => 0),
  paymentMethod: varchar('payment_method', { enum: ["edahabia", "cache"]}),
  metadata: customJsonb<{customer: CustomerData, price : PriceData, service? : ServiceData  }>('metadata').notNull(),
});


export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey().notNull().unique(),
  user_id: uuid('user_id').references(() => usersAuth.id),
  service_id: text('service_id').references(() => services.id),
  start_date: date('start_date').notNull().defaultNow(),
  end_date: date('end_date').notNull(),
  status: varchar('status', { length: 10, enum : ['Active', 'Cancelled', 'Expired'] }).notNull().default("Active"),
});