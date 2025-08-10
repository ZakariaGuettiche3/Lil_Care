// In this file we are going to define the schema for the form collection and export it.

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import {
    Chat,
    messages,
    sections,
    discounts,
    services,
    invoices,
    children,
    events,
    schedules,
    jobs,
    modules,
    seasons,
    usersAuth,
    notifications,
    Preregistrations,
    section_modules,
    educators,
    therapists,
    admins,
    accountants,
    psychologists,
    parents, educationalSchedule,
} from "@/db/schema";
import exp from "constants";


export const userFormSchema = createInsertSchema(usersAuth);
export const userFormSelectSchema = createSelectSchema(usersAuth);

export const childrenFormSchema = createInsertSchema(children);
export const childrenFormSelectSchema = createSelectSchema(children);

export const chatFormSchema = createInsertSchema(Chat);
export const chatFormSelectSchema = createSelectSchema(Chat);

export const messageFormSchema = createInsertSchema(messages);
export const messageFormSelectSchema = createSelectSchema(messages);

export const sectionFormSchema = createInsertSchema(sections);
export const sectionFormSelectSchema = createSelectSchema(sections);

export const discountFormSchema = createInsertSchema(discounts);
export const discountFormSelectSchema = createSelectSchema(discounts);

export const serviceFormSchema = createInsertSchema(services);
export const serviceFormSelectSchema = createSelectSchema(services);



export const invoiceFormSchema = createInsertSchema(invoices);
export const invoiceFormSelectSchema = createSelectSchema(invoices);

export const eventFormSchema = createInsertSchema(events);
export const eventFormSelectSchema = createSelectSchema(events);

export const scheduleFormSchema = createInsertSchema(schedules);
export const scheduleFormSelectSchema = createSelectSchema(schedules);

export const jobFormSchema = createInsertSchema(jobs);
export const jobFormSelectSchema = createSelectSchema(jobs);

export const moduleFormSchema = createInsertSchema(modules);
export const moduleFormSelectSchema = createSelectSchema(modules);

export const seasonFormSchema = createInsertSchema(seasons);
export const seasonFormSelectSchema = createSelectSchema(seasons);

export const educationalScheduleFormSchema = createInsertSchema(educationalSchedule);
export const educationalScheduleFormSelectSchema = createSelectSchema(educationalSchedule);

export const notificationFormSchema = createInsertSchema(notifications);
export const notificationFormSelectSchema = createSelectSchema(notifications);

export const preregistrationFormSchema = createInsertSchema(Preregistrations);
export const preregistrationFormSelectSchema = createSelectSchema(Preregistrations);

export const sectionModuleFormSchema = createInsertSchema(section_modules);
export const sectionModuleFormSelectSchema = createSelectSchema(section_modules);

export const userAuthFormSchema = createInsertSchema(usersAuth);
export const userAuthFormSelectSchema = createSelectSchema(usersAuth);

export const childLocationFormSchema = createInsertSchema(children);
export const childLocationFormSelectSchema = createSelectSchema(children);

export const educatorFormSchema = createInsertSchema(educators);
export const educatorFormSelectSchema = createSelectSchema(educators);

export const parentFormSchema = createInsertSchema(parents);
export const parentFormSelectSchema = createSelectSchema(parents);

export const psychologistFormSchema = createInsertSchema(psychologists);
export const psychologistFormSelectSchema = createSelectSchema(psychologists);

export const accountantFormSchema = createInsertSchema(accountants);
export const accountantFormSelectSchema = createSelectSchema(accountants);

export const adminFormSchema = createInsertSchema(admins);
export const adminFormSelectSchema = createSelectSchema(admins);

export const therapistFormSchema = createInsertSchema(therapists);
export const therapistFormSelectSchema = createSelectSchema(therapists);

