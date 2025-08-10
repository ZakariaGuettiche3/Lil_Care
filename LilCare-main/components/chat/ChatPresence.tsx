"use client";
import { useSessionUser } from "@/lib/hooks";
import { supabaseBrowser } from "@/lib/supabase/browser";
import React, { useEffect, useState } from "react";

export default function ChatPresence() {
	const user = useSessionUser(state => state.currentUser)
	const supabase = supabaseBrowser();
	const [onlineUsers, setOnlineUsers] = useState(0);

	useEffect(() => {
		const channel = supabase.channel("room1");
		channel
			.on("presence", { event: "sync" }, () => {
				const userIds = [];
				for (const id in channel.presenceState()) {
					// @ts-ignore
					userIds.push(channel.presenceState()[id][0].user_id);
				}
				setOnlineUsers(Array.from(new Set(userIds)).length);
			})
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					await channel.track({
						online_at: new Date().toISOString(),
						user_id: user?.id,
					});
				}
			});
	}, [user]);

	if (!user) {
		return <div className=" h-3 w-1"></div>;
	}

	return (
		<div className="flex items-center gap-1">
			<div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
			<h1 className="text-sm text-gray-400">{onlineUsers} onlines</h1>
		</div>
	);
}
