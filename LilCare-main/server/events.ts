"use server";
import {Concrete, EventData, EventInsert} from "@/types";
import { db } from "../db/index";
import { events, schedules, services } from "@/db/schema";
import { toSql } from "@/lib/utils";
import {undefined, z} from "zod";
import { EventsInsertSchema } from "@/db/forms/formsSchema";
import { createService } from "./payment";
import { getTableColumns } from "drizzle-orm";



export async function getEvents(
  params?: Concrete<EventData>
): Promise<EventData[]> {
  const query = toSql(events, params);
  if (!query) return await db.select().from(events);
  const newEvents = await db.select().from(events).where(query);
  return newEvents;
}

// export async function createEvent(params: z.infer<typeof EventsInsertSchema>) {
//   try {
//     // create service
//     const  { data, error } = await createService(params.service);
//     const serviceId = data?.service?.id;
//     const prices = data?.prices;
//
//     if (!serviceId || !prices) return {data: null, error : "Service not created"};
//
//     // create schedule
//
//     const createdSchedule = await db
//       .insert(schedules)
//       .values(params.schedule)
//       .returning(getTableColumns(schedules));
//     const scheduleId = createdSchedule.at(0)?.id;
//     // create event
//     if (!scheduleId) return { data : null, error : "Schedule not created"};
//
//     const { start , end } = createdSchedule?.at(0)!
//     const event : EventInsert = {
//       serviceId,
//       title: params.title,
//       photo: params.photo,
//       description: params.description,
//       scheduleId: scheduleId, // Add the scheduleId property
//       metadata: { prices, schedule: { start, end}}
//     }
//     const response = await db
//       .insert(events)
//       .values(event)
//       .returning(getTableColumns(events));
//
//     return { data: response, error: null };
//   } catch (error) {
//     const err = error as Error;
//     return { data: null, error: err.message };
//   }
// }
