"use server";
import { Concrete, PreregestrationInsert, PreregistrationData } from "@/types";
import { create } from "zustand";
import { db } from "../db/index";
import { Preregistrations, children, parents } from "@/db/schema";
import { get } from "http";
import { toSql } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { PreRegistrationAcceptSchema } from "@/db/forms/formsSchema";
import {supabaseServer} from "@/lib/supabase/server";

export async function createPreRegistration(params: PreregestrationInsert) {
  const pregister = await db
    .insert(Preregistrations)
    .values(params)
    .returning({ id: Preregistrations.id });

  return pregister.at(0);
}

export const getPreregistrations = async (
  params?: Concrete<PreregistrationData>
) => {
  const query = toSql(Preregistrations, params);

  let results;
  if (!query) {
    results = await db.select().from(Preregistrations);
  } else {
    results = await db.select().from(Preregistrations).where(query);
  }
  return results;
};

export const acceptPreregistration = async (
  params: z.infer<typeof PreRegistrationAcceptSchema>
) => {
  try {
    const supabase = await supabaseServer();

    const { email, password, phone } = params;
    const { child, ...rest } = params;
    console.log({params})
    const insertedUser = supabase?.auth.admin.createUser({
      email,
      password,
      phone,
      user_metadata : { ...rest }
    });
    const signUp = await insertedUser;
    console.log(signUp);
    
    const userId = (await insertedUser)?.data.user?.id;

    if (userId) {

    const parentRest = await db
      .insert(parents)
      .values({ ...rest, userId: userId })
      .returning({ id: parents.cardId });
    if (!parentRest) throw new Error("parent not created");

    const childRes = await db
      .insert(children)
      .values({ ...child, parent: params.cardId })
      .returning({ id: children.id });
    if (!childRes) throw new Error("child not created");

    const res = await db
      .update(Preregistrations)
      .set({ confirmed: true })
      .where(eq(Preregistrations.parentEmail, params.email));

    return { data: res, error: null};
    }
    throw new Error("User has been created");
  } catch (error) {
    const err = error as Error
    return { data: null, error: err.message };
  }
};
