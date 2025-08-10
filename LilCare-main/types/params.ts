import { nutritionSchedule } from '@/db/modules/calendar';
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
    ChatMembers,
    MedicalRecord,
    PsychologicalProfile,
    educationalSchedule,
    ChildLocation,
    subscriptions, customers,
} from "@/db/schema";

    // in this section we define the types of the params that we will be inserted in the database

    export type SectionInsert = typeof sections.$inferInsert;

    export type ChatInsert = typeof Chat.$inferInsert;

    export type MessageInsert = typeof messages.$inferInsert;

    export type DiscountInsert = typeof discounts.$inferInsert;

    export type DiscountSelect = typeof discounts.$inferSelect;

    export type ServiceInsert = typeof services.$inferInsert;

    export type SubscriptionInsert = typeof subscriptions.$inferInsert;

    export type ChildLocationInsert = typeof ChildLocation.$inferInsert;
    
    export type InvoiceInsert = typeof invoices.$inferInsert;

    export type ChildInsert = typeof children.$inferInsert;

    export type MedicalRecordInsert = typeof MedicalRecord.$inferInsert;

    export type NutritionInsert = typeof nutritionSchedule.$inferInsert

    export type EventInsert = typeof events.$inferInsert;

    export type ScheduleInsert = typeof schedules.$inferInsert;

    export type JobInsert = typeof jobs.$inferInsert;

    export type ModuleInsert = typeof modules.$inferInsert;

    export type SeasonInsert = typeof seasons.$inferInsert;


    export type EducationalScheduleInsert = typeof educationalSchedule.$inferInsert;

    export type NotificationInsert = typeof notifications.$inferInsert;

    export type CustomerInsert = typeof customers.$inferInsert

    export type SectionModuleInsert = typeof section_modules.$inferInsert;

    export type SectionModuleSelect = typeof section_modules.$inferSelect;

    export type PreregestrationInsert = typeof Preregistrations.$inferInsert;
    // in this section we define the types of the params that we will be passed into the server functions

    export type ChatMembersInsert = typeof ChatMembers.$inferInsert;


    export type PsychologicalProfileInsert = typeof PsychologicalProfile.$inferInsert

    
    type CommonUserParams = {
        cardId: number;
        firstName: string;
        lastName: string;
        birthDate: string;
        phone: string;
        userId?: string;
        email: string;
        password: string;
        username: string;
        photo: string;
        createdAt: string;
      };
      
      type EducatorParams = CommonUserParams & {
        role: "EDUCATOR";
        section: number;
        job: number;
      };
      
      type ParentParams = CommonUserParams & {
        role: "PARENT";
      };
      
      type TherapistParams = CommonUserParams & {
        role: "THERAPIST";
        section?: number;
        specialization: string;
      };
      
      type AdminParams = CommonUserParams & {
        role: "ADMIN";
      };
      
      type PsychologistParams = CommonUserParams & {
        role: "PSYCHOLOGIST";
        licenseNumber: string;
      };
      
      type AccountantParams = CommonUserParams & {
        role: "ACCOUNTANT";
        certification?: string;
      };
      
      export type CreateUserParams =
      { id?: string } & (
        | EducatorParams
        | ParentParams
        | TherapistParams
        | AdminParams
        | PsychologistParams
        | AccountantParams
      )

    export type UserAuthInsert = Omit<typeof usersAuth.$inferInsert,"rawUserMetadata"> & {
        rawUserMetadata: CreateUserParams;
    } ;
    

    export type Concrete<Type> = {
      [Property in keyof Type]?: Type[Property];
    };



  export type ScheduleParams = Omit<ScheduleInsert, "type"> & ({
    type : "event"
    event: EventInsert
  } | {
    type : "education"
    education: EducationalScheduleInsert
  } | {
    type : "nutrition"
    nutrition: NutritionInsert
  })