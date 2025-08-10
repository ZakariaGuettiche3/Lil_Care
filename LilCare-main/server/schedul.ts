"use server"

import {
    Concrete,
    EducationalScheduleData,
    NutritionInsert, ScheduleData,
    ScheduleParams
} from "@/types"
import { db } from '@/db';
import {schedules, educationalSchedule, nutritionSchedule} from "@/db/modules";
import {eq, getTableColumns} from "drizzle-orm";
import {ScheduleFormSchema} from "@/db/forms/formsSchema";
import {z} from "zod";
import {toSql} from "@/lib/utils";





interface ServerResponse<T> {
    data: T;
    error: null;
}

// export const createSchedule = async (schedule : z.infer<typeof  ScheduleFormSchema>) => {
//
//     try {
//         switch (schedule.type) {
//             case "education" :
//                 const education = schedule.education!
//                 const {title: t, description: d, start: s, end: e} = education
//
//                 const edu = (await db.insert(schedules).values({title: t, description: d, start: s, end: e, type: "education"}).returning(getTableColumns(schedules))).at(0);
//                 if (!edu) return {data: null, error: "schedule has not been created"}
//                 const {moduleId, sectionId} = education
//                 const res = await db.insert(educationalSchedule).values({scheduleId: edu.id, moduleId, sectionId, metadata: education}).returning(getTableColumns((educationalSchedule)))
//                 return {data: edu, error: null}
//                 break
//
//             case "nutrition" :
//                 const nutrition = schedule.nutrition!
//                 const {title, description, content, start, end} = nutrition
//                 const nut = (await db.insert(schedules).values({title, description,content, start, end, type: "nutrition"}).returning(getTableColumns(schedules))).at(0);
//                 if (!nut) return {data: null, error: "schedule has not been created"}
//                 const resNut = await createNutrition({scheduleId: nut.id, title, description, content})
//
//                 return resNut
//             default:
//                 return { data: null, error: "Invalid schedule type"};
//
//         }
//     }   catch (e) {
//          const err = e as Error
//          return { data: null, error: err.message}
//     }
//
//
// }


// export const createSectionSchedule = async (schedule : ScheduleParams) => {
//
//     if (schedule.type === "education") {
//         const {data: insertedSchedule, error} = await createSchedule(schedule);
//         if (!insertedSchedule) return {data: null, error}
//         const { education } = schedule;
//         const schedule_id = insertedSchedule.id;
//         const ed : EducationalScheduleData | undefined = (await db.insert(educationalSchedule).
//         values({scheduleId: schedule_id, sectionId: education.sectionId, moduleId: education.moduleId}).returning(getTableColumns(educationalSchedule)))?.at(0);
//
//         return {data: ed, error: null}
//
//     }
//
//     if (schedule.type === "nutrition") {
//         const {data: insertedSchedule, error} = await createSchedule(schedule);
//         if (!insertedSchedule) return {data: null, error}
//         const { nutrition } = schedule;
//         const schedule_id = insertedSchedule.id;
//         const ed = await createNutrition({...nutrition, scheduleId: schedule_id});
//         return {data: ed, error: null}
//     }
// }


export const createNutrition = async (nutrition : NutritionInsert) => {
try {
        const insertedSchedule = (await db.insert(nutritionSchedule).values(nutrition).returning(getTableColumns(schedules))).at(0);
        if (!insertedSchedule) throw new Error("failed to insert schedule")
        return {data: insertedSchedule, error: null}
    } catch (error) {
        const err = error as Error;
        return {data: null, error: err?.message}
    }
}


export const getSchedules = async (params ?: Concrete<ScheduleData>) => {
    const query = toSql(schedules, params)
    const sql = db.select().from(schedules)
    if (!query) return await sql;

    return await sql.where(query)
}
export const getSectionSchedules = async (params? :Concrete<EducationalScheduleData>) =>{
    const query = toSql(educationalSchedule, params)
    const sql = db.select(getTableColumns(schedules)).from(schedules)
        .leftJoin(educationalSchedule, eq(educationalSchedule.scheduleId, schedules.id))
    if (!query) return await sql;

    return await sql.where(query)
}


