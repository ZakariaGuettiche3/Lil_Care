"use client";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useRef } from "react";
import { supabaseBrowser } from "../supabase/browser";
import { useSessionUser } from "../hooks";
import {supabaseServer} from "@/lib/supabase/server";

export default function InitUser() {
	const initState = useRef(false);

	useEffect(() => {
		const supabase =  supabaseBrowser();

		const channel = supabase.channel("room1");
		channel
			.on("presence", { event: "sync" }, () => {
				const userIds = [];
				for (const id in channel.presenceState()) {
					// @ts-ignore
					userIds.push(channel.presenceState()[id][0].user_id);
				}
			})
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({
						online_at: new Date().toISOString(),
					});
				}
			})

		supabase.auth.getUser().then((session) => {
			useSessionUser.setState({currentUser : session.data?.user || undefined})
		})
		initState.current = true;

		return () => {
			supabase.channel("room1").unsubscribe(5000)
		}
		// eslint-disable-next-line
	}, []);

	return <></>;
}
