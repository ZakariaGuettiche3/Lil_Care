import { createBrowserClient } from "@supabase/ssr";
import { Database } from "../types/supabase";
import {NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL} from "@/lib/constant";




export const supabaseBrowser = () =>
	createBrowserClient<Database>(
		NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_SUPABASE_ANON_KEY, {

		}
	);
