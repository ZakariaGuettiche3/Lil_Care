"use server";

import { chargily } from './chargily';
import { supabaseServer } from "@/lib/supabase/server";
import { toSql } from "@/lib/utils";
import { and, eq, getTableColumns } from "drizzle-orm";
import {
  educators,
  parents,
  therapists,
  admins,
  accountants,
  psychologists,
  Preregistrations,
  customers,
} from "@/db/schema";
import { usersAuth } from "@/db/schema";
import {
  AccountantData,
  AdminData,
  Concrete,
  CreateUserParams,
  EducatorData,
  ParentData,
  PreregestrationInsert,
  PsychologistData,
  TherapistData,
  UserAuthData,
  UsersAuthSelect,
} from "@/types";
import { db } from "@/db";

export async function createPreRegistration(params: PreregestrationInsert) {
  const pregister = await db
    .insert(Preregistrations)
    .values(params)
    .returning({ id: Preregistrations.id });

  return pregister.at(0);
}

export const createUser = async (params: CreateUserParams) => {
  const { firstName, lastName, phone } = params;
  const { email, password } = params;

  const supabase = await supabaseServer();
  const customer = await chargily.createCustomer({
    name: `${firstName} ${lastName}`,
    email,
    phone,
  });
  console.log(supabase);

  
  const insertedUser = supabase?.auth?.signUp({
    email,
    password,
    phone,
    options: { data: { ...params, customerId: customer.id } },
  });
  const signUp = await insertedUser;
  console.log(signUp);
  
  const insertedUserId = (await insertedUser)?.data.user?.id;

  let results;
  if (insertedUserId) {
    switch (params.role) {
      case "EDUCATOR":
        // Handle educator creation logic
        const EducatorColumns = getTableColumns(educators)
        results = await db
          .insert(educators)
          .values({ ...params, userId: insertedUserId }).returning(EducatorColumns);
        break;
      case "PARENT":
        // Handle parent creation logic
        const ParentColumns = getTableColumns(parents)
        const cust = await chargily.createCustomer({name: `${firstName} ${lastName}`, email, phone})
        const myCustomers = await db.insert(customers).values({id : cust.id, name: `${firstName} ${lastName}`, email, phone}).returning(getTableColumns(customers));
        const insertedCustomerId = myCustomers?.at(0)?.id;
        if (!insertedCustomerId) return {error: "failed to insert customer", data: null}
        results = await db
          .insert(parents)
          .values({ ...params, userId: insertedUserId,customerId: insertedCustomerId }).returning(ParentColumns);
        break;
      case "THERAPIST":
        // Handle therapist creation logic
        const TherapistColumns = getTableColumns(therapists)
        results = await db
          .insert(therapists)
          .values({ ...params, userId: insertedUserId }).returning(TherapistColumns)
        break;
      case "ADMIN":
        // Handle admin creation logic
        const AdminColumns = getTableColumns(admins)
        results = await db
          .insert(admins)
          .values({ ...params, userId: insertedUserId }).returning(AdminColumns)
        break;
      case "PSYCHOLOGIST":
        // Handle psychologist creation logic
        const PsychologistColumns = getTableColumns(psychologists)
        results = await db
          .insert(psychologists)
          .values({ ...params, userId: insertedUserId }).returning(PsychologistColumns)
        break;
      case "ACCOUNTANT":
        // Handle accountant creation logic
        const AccountantColumns = getTableColumns(accountants)
        results = await db
          .insert(admins)
          .values({ ...params, userId: insertedUserId }).returning(AccountantColumns)
        break;
      default:
        throw new Error("Invalid user role");
    }
    return results;
  } else {
    throw new Error("failed to insert userAuth");
  }

  // Common creation logic for all user types
  // ...
};

export const upsertUser = async (
  params: CreateUserParams & { id?: string }
) => {
  const { id } = params;
  if (id) {
    return updateUser({...params, id: id} );
  } else {
    return createUser(params);
  }
};

export const getEducators = async (params?: Concrete<EducatorData>) => {

  const query = toSql(educators, params);

  const sql = db
  .select({ ...getTableColumns(usersAuth) })
  .from(educators)
  .leftJoin(usersAuth, eq(educators.userId, usersAuth.id));
  if (!query) {
    const educatorsData = (await sql) as UsersAuthSelect[];
    return educatorsData;
  }
  const educatorsData = (await sql.where(query)) as UsersAuthSelect[];

  return educatorsData;
}

export const getParents = async (
  params?: Concrete<ParentData>
): Promise<UsersAuthSelect[]> => {
  const query = toSql(parents, params);
  let parentsData;

  if (!query) {
    parentsData = (await db
      .select({ ...getTableColumns(usersAuth) })
      .from(parents)
      .leftJoin(
        usersAuth,
        eq(parents.userId, usersAuth.id)
      )) as UsersAuthSelect[];

    return parentsData;
  }
  parentsData = (await db
    .select({ ...getTableColumns(usersAuth) })
    .from(parents)
    .leftJoin(usersAuth, eq(parents.userId, usersAuth.id))
    .where(query)) as UsersAuthSelect[];
  return parentsData;
};

export const getPsychologists = async (
  params?: Concrete<PsychologistData>
): Promise<UsersAuthSelect[]> => {
  const query = toSql(psychologists, params);
  let psychologistsData;

  if (!query) {
    psychologistsData = (await db
      .select({ ...getTableColumns(usersAuth) })
      .from(psychologists)
      .leftJoin(
        usersAuth,
        eq(psychologists.userId, usersAuth.id)
      )) as UsersAuthSelect[];

    return psychologistsData;
  }
  psychologistsData = (await db
    .select({ ...getTableColumns(usersAuth) })
    .from(psychologists)
    .leftJoin(usersAuth, eq(psychologists.userId, usersAuth.id))
    .where(query)) as UsersAuthSelect[];
  return psychologistsData;
};

export const getAccountants = async (
  params?: Concrete<AccountantData>
): Promise<UsersAuthSelect[]> => {
  const query = toSql(accountants, params);
  let accountantsData;

  if (!query) {
    accountantsData = (await db
      .select({ ...getTableColumns(usersAuth) })
      .from(accountants)
      .leftJoin(
        usersAuth,
        eq(accountants.userId, usersAuth.id)
      )) as UsersAuthSelect[];

    return accountantsData;
  }
  accountantsData = (await db
    .select({ ...getTableColumns(usersAuth) })
    .from(accountants)
    .leftJoin(usersAuth, eq(accountants.userId, usersAuth.id))
    .where(query)) as UsersAuthSelect[];
  return accountantsData;
};

export const getAdmins = async (
  params?: Concrete<AdminData>
): Promise<UsersAuthSelect[]> => {
  const query = toSql(admins, params);
  let adminsData;

  if (!query) {
    adminsData = (await db
      .select({ ...getTableColumns(usersAuth) })
      .from(admins)
      .leftJoin(
        usersAuth,
        eq(admins.userId, usersAuth.id)
      )) as UsersAuthSelect[];

    return adminsData;
  }
  adminsData = (await db
    .select({ ...getTableColumns(usersAuth) })
    .from(admins)
    .leftJoin(usersAuth, eq(admins.userId, usersAuth.id))
    .where(query)) as UsersAuthSelect[];
  return adminsData;
};

export const getTherapists = async (
  params?: Concrete<AdminData>
): Promise<UsersAuthSelect[]> => {
  const query = toSql(therapists, params);
  let therapistsData;

  if (!query) {
    therapistsData = (await db
      .select({ ...getTableColumns(usersAuth) })
      .from(therapists)
      .leftJoin(
        usersAuth,
        eq(therapists.userId, usersAuth.id)
      )) as UsersAuthSelect[];

    return therapistsData;
  }
  therapistsData = (await db
    .select({ ...getTableColumns(usersAuth) })
    .from(admins)
    .leftJoin(usersAuth, eq(therapists.userId, usersAuth.id))
    .where(query)) as UsersAuthSelect[];
  return therapistsData;
};

export const updateUser = async (
  params: CreateUserParams & { id: string }
) => {
  const { firstName, lastName, phone, email, password, id :userId } = params;

  const supabase = await supabaseServer();
  console.log(params);
  
  const user = await supabase.auth.updateUser(
    {
      email,
      password,
      phone,
      data: { ...params },
    },
    { emailRedirectTo: email }
  );

  let results;

  switch (params.role) {
    case "EDUCATOR":
      const EducatorColumns = getTableColumns(educators)
      results = await db
        .update(educators)
        .set({ ...params })
        .where(eq(educators.userId, userId)).returning(EducatorColumns);
      break;
    case "PARENT":
      // Handle parent creation logic
      results = await db
        .update(parents)
        .set({ ...params })
        .where(eq(parents.userId, userId)).returning(getTableColumns(parents));
      break;
    case "THERAPIST":
      // Handle therapist creation
      results = await db
        .update(therapists)
        .set({ ...params })
        .where(eq(therapists.userId, userId)).returning(getTableColumns(therapists));
      break;
    case "ADMIN":
      // Handle admin creation logic
      results = await db
        .update(admins)
        .set({ ...params })
        .where(eq(admins.userId, userId)).returning(getTableColumns(admins));
      break;
    case "PSYCHOLOGIST":
      // Handle psychologist creation logic
      results = await db
        .update(psychologists)
        .set({ ...params })
        .where(eq(psychologists.userId, userId)).returning(getTableColumns(psychologists));
      break;
    case "ACCOUNTANT":
      // Handle accountant creation logic
      results = await db
        .update(accountants)
        .set({ ...params })
        .where(eq(accountants.userId, userId)).returning(getTableColumns(accountants));
      break;
    default:
      throw new Error("Invalid user role");
  }

  return results;
};


export const getUsers = async (params?: Concrete<UserAuthData>) : Promise<UserAuthData[]> => {
  const query = toSql(usersAuth, params);
  let usersData;

  if (!query) {
    usersData = await db.select().from(usersAuth);
    return usersData as UserAuthData[];
  }
  usersData = await db.select().from(usersAuth).where(query);
  return usersData as UserAuthData[];
};

export async function logoutServer() {
  const supabase = await supabaseServer();
  const log = await supabase.auth.signOut();
  return log
}
