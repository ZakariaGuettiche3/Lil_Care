"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import ChatPresence from "./ChatPresence";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChatInfo } from "./ChatInfo";
import { ChatData, UserAuthData } from "@/types";

type Props = {
	chat?: ChatData,
	chatMemebers? : UserAuthData[]

}

export default function ChatHeader({ chat, chatMemebers }: Props) {
	const router = useRouter();

	


	return (
		<div className="h-16">
			<div className="p-2 border-b flex items-center justify-between h-full">
				<div className="flex gap-3">
					<Avatar className="w-14 h-14">
						<AvatarImage  src = {chat?.groupPhoto || undefined} />
						
					</Avatar>
					<div>

					<h1 className="text-lg font-bold mr-auto">{ chat?.name}</h1>
					<ChatPresence />
					</div>
					
				</div>
				<ChatInfo chatMembers = {chatMemebers} chat = {chat} />
			</div>
		</div>
	);
}
