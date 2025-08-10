"use server";
import { Concrete, SectionData } from "@/types";
import { db } from "../db/index";
import { jobs, sections, services } from "@/db/schema";
import { toSql } from "@/lib/utils";
import { z } from "zod";
import { SectionsInsertSchema } from "@/db/forms/formsSchema";
import { createService } from "./payment";
import { getTableColumns } from "drizzle-orm";

export async function getSections(
  params?: Concrete<SectionData>
): Promise<SectionData[]> {
  const query = toSql(sections, params);
  if (!query) return await db.select().from(sections);
  const newSections = await db.select().from(sections).where(query);
  return newSections;
}

export const getJobs = async () => {
  const JobsData = await db.select().from(jobs);
  return JobsData;

}

export async function createSection(
  params: z.infer<typeof SectionsInsertSchema>
) {
  try {
    const { service, ...restParams } = params;
    console.log({ service });
    const { data, error } = await createService(service!);
    if (!data) return { data: null, error}
    const { service : { id } , prices } = data
    if (!id || !prices) throw new Error("Service not created");
    const response = await db
      .insert(sections)
      .values({
        ...restParams,
        service: id,
        metadata: { prices },
      })
      .returning(getTableColumns(sections));
    return { data: response, error: null };
  } catch (error) {
    const err = error as Error
    return { data: null, error: err?.message! };
  }
}
