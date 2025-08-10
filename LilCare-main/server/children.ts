"use server";
import {
  ChildLocation,
  children,
  parents,
  sections,
  MedicalRecord,
  PsychologicalProfile,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm/sql";
import { db } from "@/db";
import {
  ChildData,
  ChildInsert,
  ChildLocationInsert,
  Children,
  Concrete,
  MedicalRecordInsert,
} from "@/types";
import { getTableColumns } from "drizzle-orm";
import { toSql } from "@/lib/utils";

export const getChildren = async (params?: Concrete<ChildData>) => {
  console.log({ params });

  const query = toSql(children, params);
  const { parent, section, ...rest } = getTableColumns(children);
  const dataQuery = db
    .select({
      parent: parents,
      section: sections,
      medicalRecord: MedicalRecord,
      ...rest,
    })
    .from(children)
    .leftJoin(parents, eq(parents.cardId, children.parent))
    .leftJoin(MedicalRecord, eq(MedicalRecord.childId, children.id))
    .leftJoin(ChildLocation, eq(ChildLocation.childId, children.id))
    .leftJoin(sections, eq(sections.id, children.section));

  if (!query) return (await dataQuery) as Children[];

  return (await dataQuery.where(query)) as Children[];
};

export const getChildrenTable = async (params?: Concrete<ChildData>) => {
  const { section, parent, id, firstName, lastName, birthDate, photo } =
    children;
  const query = await db
    .select({
      parent: parents,
      section: sections,
      firstName,
      lastName,
      birthDate,
      id,
      photo,
      medicalRecord: MedicalRecord,
    })
    .from(children)
    .leftJoin(parents, eq(parents.cardId, children.parent))
    .leftJoin(MedicalRecord, eq(MedicalRecord.childId, children.id))
    .leftJoin(sections, eq(sections.id, children.section));
  const childrenData = await query;

  return childrenData as Children[];
};

export const createChild = async (child: ChildInsert) => {
  try {
    const response = await db
      .insert(children)
      .values(child)
      .returning(getTableColumns(children));
  
    const childId = response.at(0)?.id;
    if (!childId)  throw new Error("Child was not created");
    const location = await db
      .insert(ChildLocation)
      .values({
        childId: childId,
        sectionId: child.section,
        latitude: "0",
        longitude: "0",
        timestamp: (new Date()),
        accuracy: "0",
      })
      .returning(getTableColumns(ChildLocation));
  
    return { data : response, error: null};
    
  } catch (error) {
    const err = error as Error
    return { data: null, error: err.message};
    
  }
};

export const createMedicalRecord = async (
  medicalRecord: MedicalRecordInsert
) => {
  const columns = getTableColumns(MedicalRecord);
  if (!medicalRecord.id) {
    const res = await db
      .insert(MedicalRecord)
      .values(medicalRecord)
      .returning({ ...columns });
    return res.at(0);
  }
  const res = await db
    .update(MedicalRecord)
    .set(medicalRecord)
    .where(eq(MedicalRecord.id, medicalRecord.id))
    .returning({ ...columns });
  return res.at(0);
};



export const updateLocation = async (location: ChildLocationInsert) => {
  try {
    console.log({ location });
    
    
    const columns = getTableColumns(ChildLocation);
    const res = await db
      .update(ChildLocation)
      .set(location)
      .where(eq(ChildLocation.sectionId!, location.sectionId!))
      .returning({ ...columns });
    return {data : res, error: null};
  } catch (error) {
    const err = error as Error;
    return {data: null, error: err?.message};
  }

}

export const createPsycologicalProfile = async (
  psycolgical: typeof PsychologicalProfile.$inferInsert
) => {
  const columns = getTableColumns(PsychologicalProfile);
  if (!psycolgical.id) {
    const res = await db
      .insert(PsychologicalProfile)
      .values(psycolgical)
      .returning({ ...columns });
    return res.at(0);
  }
  const res = await db
    .update(PsychologicalProfile)
    .set(psycolgical)
    .where(eq(PsychologicalProfile.id, psycolgical.id))
    .returning({ ...columns });
  return res.at(0);
};

export const getParentChildrenDetails = async (parentCardId?: number) => {
  if (!parentCardId) return [];
  const childrenColumns = getTableColumns(children);
  const kids = (await db
    .select({ ...childrenColumns, parent: parents, section: sections })
    .from(children)
    .leftJoin(sections, eq(children.section, sections.id))
    .leftJoin(parents, eq(parents.cardId, children.parent))
    .where(eq(children.parent, parentCardId))) as Children[];

  return kids;
};

export const updateChild = async (child: ChildData) => {
  const columns = getTableColumns(children);
  const res = await db
    .update(children)
    .set(child)
    .where(eq(children.id, child.id))
    .returning({ ...columns });
  return res.at(0) as ChildData;
};
