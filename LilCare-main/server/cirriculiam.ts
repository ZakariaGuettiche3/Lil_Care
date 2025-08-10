"use server";
import { db } from "@/db";
import { AxiosError } from "axios";
import {educationalSchedule, modules, schedules, seasons, section_modules } from "@/db/schema";
import { eq, getTableColumns } from "drizzle-orm";
import { toSql } from "@/lib/utils";
import { ModuleInsert, Concrete, Section, SectionData, EducationalScheduleData, ModuleData, SectionModuleData } from "@/types";

export const createModule = async (module: ModuleInsert) => {
  try {
    const result = await db.insert(modules).values(module).returning(getTableColumns(modules));

    if (result.length === 0) {
      throw new AxiosError("Failed to Insert module");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const createEducationalSchedule = async ({
  section,
  schedules,
}: {
  section: SectionData;
  schedules: EducationalScheduleData[];
}) => {
  const columns = getTableColumns(educationalSchedule);

  const data = schedules.map((schedule) => ({ scheduleId: schedule.id, sectionId: section.id}));
  const res = await db
    .insert(educationalSchedule)
    .values(data)
    .returning(columns);

  return res;
};

export async function getSectionModules(params?: Concrete<SectionModuleData>) : Promise<ModuleData[]> {
  const query = toSql(section_modules, params);
  if (!query)
    return (
      await db
        .select()
        .from(section_modules)
        .leftJoin(modules, eq(section_modules.moduleId, modules.id))
    ).map((row) => row.modules as ModuleData);
  const SectionModules =  ( await db
    .select()
    .from(section_modules)
    .leftJoin(modules, eq(section_modules.moduleId, modules.id))
    .where(query)).map((row) => row.modules);
    
  return SectionModules as ModuleData[];
} 

export const addSectionModules = async (sectionModules : SectionModuleData[]  ) => {

    const results = await db.insert(section_modules).values(sectionModules);
    return results.count
}

export const getModules = async () => {
  const results = await db.select().from(modules);
  return results;
};

export const getSeasons = async () => {
  const results = await db.select().from(seasons);
  return results;
};
