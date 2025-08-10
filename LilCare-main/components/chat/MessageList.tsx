"use client";
import React, { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { DeleteAlert, EditAlert } from "./MessasgeActions";
import { useMessagesTable } from "@/lib/hooks";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { ArrowDown } from "lucide-react";
import { Badge } from "../ui/badge";
import Message from "./Message";
import { ChatData, MessageData, UserAuthData } from "@/types";

type Props = {
  messages: MessageData[];
  currentChat?: ChatData;
};

const MessageList = ({
                       currentChat,
                       messages: dbMessages,
                     }: Props) => {
  const params = useSearchParams().get("chatId") || undefined;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [userScrolled, setUserScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const { data: stateMessages, setData, addRow, updateRow } = useMessagesTable((state) => state);

  useEffect(() => {
    setData(dbMessages);
  }, [dbMessages, setData]);

  const supabase = supabaseBrowser();

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      setCurrentUser(session.data?.user || null);
    });
  }, [supabase]);

  useEffect(() => {
    const channel = supabase
        .channel("chat-room")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "message" },
            (payload) => {
              const newMessage = payload.new as MessageData;
              addRow(newMessage);
              if (newMessage.sender !== currentUser?.id) {
                const audio = document.getElementById("a1") as HTMLAudioElement;
                audio.play();
              }
            }
        )
        .on(
            "postgres_changes",
            { event: "DELETE", schema: "public", table: "message" },
            (payload) => {
            }
        )
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "message" },
            (payload) => {
              const updatedMessage = payload.new as MessageData;
              // updateRow?.(updatedMessage);
            }
        )
        .subscribe();

    scrollDown();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser, addRow, updateRow, supabase]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScrolled =
          scrollContainer.scrollTop <
          scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScrolled(isScrolled);
    }
  };

  const scrollDown = () => {
    setUserScrolled(false);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
      <>
        <div
            id="messages"
            className="flex h-full flex-[1] pb-2 overflow-auto flex-col gap-2 px-4"
            ref={scrollRef}
            onScroll={handleOnScroll}
        >
          <div className="flex justify-center">
            <Badge variant="secondary" className="my-2 self-center">
              {currentChat?.createdAt.toDateString()}
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            {stateMessages.map((message) => (
                <Message key={message.id} message={message} currentUser={currentUser || undefined} />
            ))}
          </div>
          <DeleteAlert />
          <EditAlert />
        </div>

        {userScrolled && (
            <div className="absolute bottom-20 w-full">
              <div
                  className="w-10 h-10 text-destructive-foreground bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all"
                  onClick={scrollDown}
              >
                <ArrowDown />
              </div>
            </div>
        )}
      </>
  );
};

export default MessageList;
