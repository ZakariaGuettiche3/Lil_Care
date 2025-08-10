import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "../types/supabase";
import {NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL} from "@/lib/constant";

export const supabaseServer = async () => {
	const cookieStore = cookies();

	return  createServerClient<Database>(
		NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				remove(key) {
					 cookieStore.delete(key)
				},

			},
		}
	);
};
