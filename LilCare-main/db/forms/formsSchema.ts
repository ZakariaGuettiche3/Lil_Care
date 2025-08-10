import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import {
  parents,
  sections,
  children,
  educators,
  events,
  schedules,
  PsychologicalProfile,
  jobs,
  Chat,
  ChatMembers,
  services,
  discounts,
  Preregistrations,
  invoices,
  modules,
  price,
  customers,
  messages,
} from "../modules";
import { metadata } from "@/app/layout";
import { Images } from "lucide-react";

export const ParentsInsertSchema = createInsertSchema(parents);

export const PriceInsertSchema = z.object({
  service_id: z.string().optional(),
  price: z.number(),
  type: z.enum(["Month", "Year", "Once", "Quarter"]),
  id : z.string().optional()
});

export const PriceSelectSchema = createSelectSchema(price, {
  price: z.number(),
  type: z.enum(["Month", "Year", "Once", "Quarter"]),
});

export const ServiceInsertSchema = createInsertSchema(services).extend({
  id: z.string().optional(),
  prices: z.array(PriceInsertSchema),
  Images: z.array(z.string()),
  metadata: z.object({
    prices: z.array(PriceInsertSchema),
  }).optional(),
});

export const ServiceSelectSchema = createSelectSchema(services).extend({
  Images: z.array(z.string()),
  metadata: z.object({
    prices: z.array(PriceSelectSchema),
  }),
});

export const SectionsInsertSchema = createInsertSchema(sections, {
  service: ServiceInsertSchema,
});
export const ScheduleInsertSchema = createInsertSchema(schedules, {
  start: z.string(),
  end: z.string(),
});
export const childInsertSchema = createSelectSchema(children);
export const EducatorInsertSchema = createInsertSchema(educators);
export const EventsInsertSchema = createInsertSchema(events).extend({
  Images: z.array(z.string()),
  service: ServiceInsertSchema,
  schedule: ScheduleInsertSchema
}) ;

export const PsychologicalProfileSchema =
  createInsertSchema(PsychologicalProfile);
export const JobInsertSchema = createInsertSchema(jobs);
export const ChatIsertSchema = createInsertSchema(Chat);
export const ChatMembersSchema = createInsertSchema(ChatMembers);
export const DiscountSelectSchema = createSelectSchema(discounts);
export const PreregestrationsSchema = createInsertSchema(Preregistrations);
export const MedicalRecordSchema = z.object({
  drugs: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  specificCare: z.string().optional(),
  previousDiseases: z.array(z.string()).optional(),
  healthNotice: z.string().optional(),
  specialDiet: z.string().optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
  otherNotice: z.string().optional(),
  childId: z.number().positive(),
});

export const CustomerInsertSchema = createInsertSchema(customers)
export const CustomerSelectSchema = createSelectSchema(customers)

export const InvoiceFormSchema = createInsertSchema(invoices, {
  receipent: CustomerSelectSchema,
  discount: DiscountSelectSchema,
  price: PriceInsertSchema,
}).extend({
  service: ServiceSelectSchema,
}).required();
export const ModuleFormSchema = createInsertSchema(modules);

const CommonUserParams = z.object({
  id: z.string().optional(),
  cardId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.string(),
  phone: z.string(),
  email: z.string(),
  password: z.string(),
  photo: z.string(),
  username: z.string(),
});




const EducatorParams = CommonUserParams.extend({
  role: z.literal("EDUCATOR"),
  section: z.number(),
  job: z.number(),
});

const ParentParams = CommonUserParams.extend({
  role: z.literal("PARENT"),
});

const TherapistParams = CommonUserParams.extend({
  role: z.literal("THERAPIST"),
  section: z.number().optional(),
  specialization: z.string(),
});

const AdminParams = CommonUserParams.extend({
  role: z.literal("ADMIN"),
});

const PsychologistParams = CommonUserParams.extend({
  role: z.literal("PSYCHOLOGIST"),
  licenseNumber: z.string(),
});

const AccountantParams = CommonUserParams.extend({
  role: z.literal("ACCOUNTANT"),
  certification: z.string().optional(),
});

export const CreateUserParamsSchema = z.union([
  EducatorParams,
  ParentParams,
  TherapistParams,
  AdminParams,
  PsychologistParams,
  AccountantParams,
]);


export const PreRegistrationAcceptSchema = ParentParams.extend({

  customerId: z.string(),
  child: childInsertSchema ,
});


export const MessageInsertSchema = createInsertSchema(messages);


export const ScheduleFormSchema = z.object({
    type : z.enum(["education", "nutrition", "event"]),
    event: EventsInsertSchema.optional(),
    education: z.object({
        title: z.string(),
        description: z.string(),
        start: z.string(),
        end: z.string(),
        sectionId: z.number(),
        moduleId: z.number()
    }).optional(),
    nutrition: z.object({
        title: z.string(),
        description: z.string(),
        start: z.string(),
        end: z.string(),
        content: z.string().array(),
    }).optional()
})