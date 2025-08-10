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
  educationalSchedule,
  ChildLocation,
  notifications,
  Preregistrations,
  section_modules,
  educators,
  parents,
  psychologists,
  accountants,
  admins,
  therapists,
  MedicalRecord,
  PsychologicalProfile,
  ChatMembers,
  customers,
  price,
} from "@/db/schema";
import {Address} from "@/vendor/types/data";

// in this section we define the types of the tables

export type SectionData = typeof sections.$inferSelect;

export type ChatData = typeof Chat.$inferSelect;

export type MessageData = typeof messages.$inferSelect;

export type DiscountData = typeof discounts.$inferSelect;

export type ServiceData = typeof services.$inferSelect;

export type Service = ServiceData  & {
  prices: PriceData[];

};

export type InvoiceData = typeof invoices.$inferSelect;

export type ChildData = typeof children.$inferSelect;

export type EventData = typeof events.$inferSelect;

export type ScheduleData = typeof schedules.$inferSelect;

export type JobData = typeof jobs.$inferSelect;

export type ModuleData = typeof modules.$inferSelect;

export type SeasonData = typeof seasons.$inferSelect;

export type EducationalScheduleData = typeof educationalSchedule.$inferSelect;

export type NotificationData = typeof notifications.$inferSelect;

export type PreregistrationData = typeof Preregistrations.$inferSelect;

export type SectionModuleData = typeof section_modules.$inferSelect;

export type ChildLocationData = typeof ChildLocation.$inferSelect;

export type EducatorData = typeof educators.$inferSelect;

export type ParentData = typeof parents.$inferSelect;

export type PsychologistData = typeof psychologists.$inferSelect;

export type AccountantData = typeof accountants.$inferSelect;

export type PriceData = {
  id: string;
  service_id: string;
  type: "Month" | "Year" | "Once" | "Quarter";
  price: number;
};

export type AdminData = typeof admins.$inferSelect;

export type TherapistData = typeof therapists.$inferSelect;

export type MedicalRecordData = typeof MedicalRecord.$inferSelect;

export type PsychologicalProfileData = typeof PsychologicalProfile.$inferSelect;

export type ChatMembersData = typeof ChatMembers.$inferSelect;

export type UserAuthData<
  T = {
    photo: string;
    username: string;
    role: Role;
    birthDate: string;
    phone: string;
    customerId: string;
  } & (EducatorData | TherapistData | ParentData | AccountantData | AdminData)
> = Omit<typeof usersAuth.$inferSelect, "rawUserMetaData"> & {
  rawUserMetaData: T;
};

export type CustomerData = typeof customers.$inferSelect;

export type Role =
  | "ADMIN"
  | "THERAPIST"
  | "PSYCHOLOGIST"
  | "ACCOUNTANT"
  | "PARENT"
  | "EDUCATOR";

export type UserAuth = {
  id: string;
  photo: string;
  email: string;
  createdAt: string;
  username: string;
  birthDate: string;
  phone?: string;
  passwrod: string;
} & (
  | ({ role: "ADMIN" } & AdminData)
  | ({ role: "THERAPIST" } & TherapistData)
  | ({ role: "PSYCHOLOGIST" } & PsychologistData)
  | ({ role: "ACCOUNTANT" } & AccountantData)
  | ({ role: "PARENT" } & ParentData)
);

export type UsersAuthSelect<T = UserAuth> = Omit<
  typeof usersAuth.$inferSelect,
  "rawUserMetaData"
> & {
  rawUserMetaData: T;
};

// In this section I will defined the data of tables with their associated data

export type Children = Omit<ChildData, "parent" | "section"> & {
  section: SectionData;
  parent: ParentData;
  location: ChildLocationData | null;
  medicalRecord: MedicalRecordData | null;
  psychologicalProfile: PsychologicalProfileData | null;
};

export type Events = Omit<EventData, "service"> & { service: ServiceData };

export type Educator = Omit<EducatorData, "section" | "job"> & {
  section: SectionData;
  job: JobData;
};

export type Section = SectionData & {
  educators: EducatorData[];
  children: ChildData[];
  modules: ModuleData[];
};

export type ChatMessage = Omit<MessageData, "chat" | "sender"> & {
  chat: ChatData;
  sender: UserAuthData;
};
export type EventSelect = Omit<EventData, "service"> & { service: ServiceData };



export interface ServerResponse<T> {
  data: T;
  error: null;
}

export interface Checkout {
  /* Unique identifier of the checkout. */
  id: string;

  /** A string representing the type of the object. */
  entity: string;

  /** True for Live Mode, False for Test Mode. */
  livemode: boolean;

  /** The total amount of the transaction. */
  amount: number;

  /** The currency code for the transaction. */
  currency: string;

  /** The fees associated with the transaction. */
  fees: number;

  /** Indicates whether the fees are passed to the customer. */
  pass_fees_to_customer: boolean;

  /** The current status of the checkout. */
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'canceled';

  /** The language of the checkout page. */
  locale: 'ar' | 'en' | 'fr';

  /** A description of the transaction. */
  description: string;

  /** The URL to which the customer will be redirected after a successful payment. */
  success_url: string;

  /** The URL to which the customer will be redirected after a failed or canceled payment. */
  failure_url: string;

  /** The webhook endpoint for receiving payment events. */
  webhook_endpoint: string;

  /** The payment method used, can be null if not specified. */
  payment_method: string | null;

  /** The invoice ID associated with the payment, can be null if not specified. */
  invoice_id: string | null;

  /** The customer ID associated with the payment, can be null if not specified. */
  customer_id: string | null;

  /** The payment link ID associated with the payment, can be null if not specified. */
  payment_link_id: string | null;

  /** A set of key-value pairs that can be used to store additional information about the checkout. */
  metadata: Record<string, any>;

  /** Timestamp indicating when the checkout was created. */
  created_at: number;

  /** Timestamp indicating when the checkout was last updated. */
  updated_at: number;

  /** The shipping address for the checkout. */
  shipping_address: Address;

  /** Indicates whether the shipping address should be collected. */
  collect_shipping_address: boolean;

  /** The URL for the checkout page where the customer completes the payment. */
  checkout_url: string;
}
