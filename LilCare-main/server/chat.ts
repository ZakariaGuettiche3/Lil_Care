"use server";

import {admins, Chat, ChatMembers, messages, usersAuth} from "@/db/schema";
import {toSql} from "@/lib/utils";
import {
  ChatData,
  ChatMembersData,
  ChatMembersInsert,
  ChatMessage,
  Concrete,
  MessageData,
  MessageInsert,
  UserAuthData
} from "@/types"; // Import the ChatMembersData type
import {db} from "@/db";
import {eq, getTableColumns} from "drizzle-orm";

// this file is for chat related functions

export async function getMessages(params: Concrete<MessageData>) {
  const query = toSql(messages, params);

  const columns = getTableColumns(messages);
  const sql = db
    .select({ ...columns })
    .from(messages)
  if (!query) {
    return await sql as MessageData[];
  } else {
    return await sql.where(query) as  MessageData[];
  }
}

export const upsertMessage = async (message: MessageData | MessageInsert) => {
  const id = message.id;

  if (id) {
    const { id, ...data } = message;
    const res = await db.update(messages).set(data).where(eq(messages.id, id!));
    return res;
  } else {
    const res = await db.insert(messages).values(message);
    return res;
  }
};

export const addChatMembers = async (chatMembers: ChatMembersInsert) => {
  const columns = getTableColumns(ChatMembers);
  const res = await db
    .insert(ChatMembers)
    .values(chatMembers)
    .returning(columns);
  return res;
};

export const getChatMembers = async (params: Concrete<ChatMembersData>) => {
  const query = toSql(ChatMembers, params);
  const columns = getTableColumns(usersAuth);
  const sql = db.select(columns)
                .from(ChatMembers).leftJoin(usersAuth, eq(usersAuth.id, ChatMembers.userId))
                .leftJoin(admins, eq(admins.userId, usersAuth.id))
                ;
  let results;
  if (!query) {
    results = await sql;
  } else {
    results =  await sql.where(query);
  }

  return results as UserAuthData[];
};

export const getChats = async (params?: Concrete<ChatMembersData>) => {
  const query = toSql(ChatMembers, params);
  const columns = getTableColumns(Chat);
  const sql = db.select(columns).from(ChatMembers).leftJoin(Chat, eq(Chat.id, ChatMembers.chatId));
  let results;
  if (!query) {
    results = await sql;
  } else {
    results =  await sql.where(query);
  }

  return results as ChatData[];
};

export const deleteChatMembers = async (params: Concrete<ChatMembersData>) => {
  const query = toSql(ChatMembers, params);
  return db.delete(ChatMembers).where(query);
};

export const deleteMessage = async (messageId: string) => {
  try {
    const res = await db
      .delete(messages)
      .where(eq(messages.id, messageId))
      .returning(getTableColumns(messages));
    return { data: res, error: null };
  } catch (error) {
    const err = error as Error;
    return { data: null, error: err };
  }
};

export const updateMessage = async (message: MessageData) => {
  try {
    const res = await db
      .update(messages)
      .set({...message})
      .where(eq(messages.id, message.id ))
      .returning(getTableColumns(messages));
    return { data: res, error: null };
  } catch (error) {
    const err = error as Error;
    return { data: null, error: err.message };
  }
};

export const insertMessage = async (message: MessageInsert) => {
  try {
    const res = await db
      .insert(messages)
      .values(message)
      .returning(getTableColumns(messages));
    return { data: res?.at(0) as MessageData, error: null };
  } catch (error) {
    const err = error as Error;
    return { data: null, error: err };
  }

}

export async function createChat(
  chatData: {
    members: Array<string>;
    chat: {
      id?: number | undefined;
      name?: string | null | undefined;
      isGroup?: boolean | null | undefined;
      createdAt?: Date | undefined;
      lastMessageAt?: Date | undefined;
      groupPhoto?: string | null | undefined;
    };
  }
) {
  const response = (
    await db.insert(Chat).values(chatData.chat).returning({ id: Chat.id })
  ).at(0);
  const id = response?.id;
  const chatId = typeof id === "string" ? parseInt(id) : id;

  if (chatId) {
    const chat_memebers = chatData.members.map((member) => ({
      chatId,
      userId: member,
    }));
    const returning = await db
      .insert(ChatMembers)
      .values(chat_memebers)
      .returning({ chatId: ChatMembers.chatId, userId: ChatMembers.userId });

   
    return returning;
  } else {
    throw new Error("failed to create chat");
  }
}
