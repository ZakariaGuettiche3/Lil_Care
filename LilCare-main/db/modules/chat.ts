import { serial, varchar, boolean, timestamp, primaryKey, text, customType, PgUUID } from "drizzle-orm/pg-core";
import { pgTable, uuid } from "drizzle-orm/pg-core";
import { usersAuth } from "./users";
import { v4 } from "uuid";
import { metadata } from "@/app/layout";
import { UserAuthData } from "@/types";
import { User } from "@supabase/supabase-js";


const customJsonb = <TData>(name: string) =>
    customType<{ data: TData; driverData: string }>({
      dataType() {
        return 'jsonb';
      },
      toDriver(value: TData): string {
        return JSON.stringify(value);
      },
      fromDriver(value: string): TData {
        return  JSON.parse(value);
      },
    })(name);


export const Chat = pgTable("chat", {
    id: serial("id").primaryKey(),
    name : varchar("name", {length: 50}),
    isGroup : boolean("isGroup").default(true),
    createdAt : timestamp("createdAt").$default(() => new Date()).notNull(),
    lastMessageAt : timestamp("lastMessageAt").$default(() => new Date()).notNull(),
    groupPhoto : varchar("groupPhoto", {length: 256}).default(""),
  
  });


  export const ChatMembers = pgTable("chat_members", {
    chatId: serial("chatId").references(() => Chat.id),
    userId : uuid("id").references(() => usersAuth.id),
  } , (t) => ({pk : primaryKey({columns : [t.chatId, t.userId]})}));
  


  export const messages = pgTable("message", {
  id: uuid("id").primaryKey().$default(() => v4()),
  text : text("text").default("").notNull(),
  createdAt : timestamp("createdAt").default(new Date()).notNull(),
  chat : serial("chat").references(() => Chat.id).notNull(),
  isEdited: boolean("isEdited").default(false).notNull(),
  files: customJsonb<{url : string, type: string, name: string, size: number}[]>("files"),
  sender : uuid("sender").references(() => usersAuth.id).notNull(),
  seen : boolean("seen").default(false).notNull(),
  metadata: customJsonb<{sender: User}>("metadata").notNull()
});