import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import { supabaseServer } from "@/lib/supabase/server";
import InitUser from "@/lib/store/InitUser";
import ChatList from "@/components/chat/ChatList";
import MessageList from "@/components/chat/MessageList";
import { redirect } from "next/navigation";
import { getChatMembers, getChats, getMessages } from "@/server/chat";
import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import MessageForm from "@/components/chat/MessageForm";
import { UserToUserAuthSelect } from "@/lib/utils";
import ChatAbout from "@/components/chat/ChatAbout";

type Props = {
  searchParams: Record<string, string>;
};

export default async function Page(props: Props) {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  const currentUser = data?.user;

  if (!currentUser) redirect("/login");
  console.log({ currentUser });

  const chat_id = parseInt(props.searchParams["chatId"]);
  const isAdmin = currentUser.user_metadata.role === "ADMIN";

  const chats = await getChats({ userId: currentUser.id });

  const currentChat = chats.filter((chat) => chat.id == chat_id).at(0);

  const chat_messages = chat_id
    ? await getMessages({ chat: chat_id })
    : undefined;


  console.log({ chat_messages });
  const chat_members = chat_id
    ? await getChatMembers({ chatId: chat_id })
    : undefined;

  return (
    <div className="flex gap-3 h-full">
      <Sidebar active="Messanger" />
      <div className="flex-1 py-2 h-full">
        <div className="flex h-full gap-3">
          {chats && (
            <ChatList
              userId={currentUser.id}
              className="max-w-60 overflow-auto"
              chats={chats}
              role="ADMIN"
            />
          )}

          <div className="h-full justify-between flex-1 border rounded-md flex flex-col relative">
            <ChatHeader chatMemebers={chat_members} chat={currentChat} />

            {currentUser ? (
              <>
                <div id="messages" className="flex-1 overflow-hidden">
                  {chat_messages ? (
                    <>
                      <MessageList
                        currentChat={currentChat}
                        messages={chat_messages}
                      />
                    </>
                  ) : (
                    <div className="h-full w-full flex justify-center items-center">
                      <Badge variant={"secondary"}> select chat </Badge>
                    </div>
                  )}
                </div>
                {chat_id ? (
                  <div>
                    <MessageForm
                      sender={UserToUserAuthSelect(currentUser)!}
                      chat={currentChat!}
                     
                    />
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              <ChatAbout />
            )}
          </div>
        </div>
      </div>
      <InitUser />
    </div>
  );
}
