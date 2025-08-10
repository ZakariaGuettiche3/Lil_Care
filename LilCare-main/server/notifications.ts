"use server"
import {eq, getTableColumns} from 'drizzle-orm';
import { db } from '../db/index';
import { notifications } from '../db/schema';
import { supabaseServer } from '../lib/supabase/server';
import { NextResponse } from 'next/server';














export const getNotifications = async () => {

    try {
    const supabase = await supabaseServer()
    const currentUser  = (await supabase.auth.getSession()).data.session?.user
    if (currentUser) {
    const results = await db.select().from(notifications).where(eq(notifications.user_id, currentUser?.id));

    return results

    }
        return []

    }
    catch (error)  {
        const err = error as Error
        return []
    }



}