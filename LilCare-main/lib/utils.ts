import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  InferInsertModel,
  SQL,
  Table,
  and,
  eq,
  getTableColumns,
} from "drizzle-orm";
import { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";

import { User } from "@supabase/supabase-js";
import { Concrete, UserAuth, UserAuthData, UsersAuthSelect } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFromAndTo(page: number, itemPerPage: number) {
  let from = page * itemPerPage;
  let to = from + itemPerPage;

  if (page > 0) {
    from += 1;
  }
  return { from, to };
}

export const calculateAge = (birthDate: string | Date) => {
  const birthday = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
};

export const toSql = <T extends TableConfig>(
  table: PgTableWithColumns<T>,
  params?: Concrete<InferInsertModel<Table<T>>>
): SQL | undefined => {
  if (!params) return undefined;
  let columns: SQL[] = [];
  Object.entries(params).forEach((entry) => {
    if (entry[1]) {
      columns.push(eq(getTableColumns(table)[entry[0]], entry[1]));
    }
  });
  if (columns.length == 1) return columns[0] as SQL;
  const query = columns.reduce(
    (acc, column) => and(acc, column) as SQL,
    columns[0]
  );
  return query;
};

export const UserToUserAuthSelect = (user?: User | null) : UsersAuthSelect | undefined => {
  if (!user) return undefined;

  const {
    id,
    app_metadata,
    user_metadata,
    aud,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_sent_at,
    new_email,
    new_phone,
    invited_at,
    action_link,
    email,
    phone,
    created_at,
    confirmed_at,
    email_confirmed_at,
    phone_confirmed_at,
    last_sign_in_at,
    role,
    updated_at,
    identities,
    is_anonymous,
    factors,
  } = user;

  const userAth = {
    id,
    aud,
    role,
    email,
    emailConfirmedAt: email_confirmed_at,
    invitedAt: invited_at,
    confirmationSentAt: confirmation_sent_at,
    recoverySentAt: recovery_sent_at,
    emailChange: new_email,
    emailChangeSentAt: email_change_sent_at,
    lastSignInAt: last_sign_in_at,
    rawAppMetaData: app_metadata,
    rawUserMetaData: user_metadata as UserAuth,
    createdAt: created_at,
    updatedAt: updated_at,
    phone,
    phoneConfirmedAt: phone_confirmed_at,
    phoneChange: new_phone,
   
    confirmedAt: confirmed_at,
    emailChangeConfirmStatus: 0, // replace with actual value
    isAnonymous: is_anonymous,
  };
  return userAth as UsersAuthSelect;
};
