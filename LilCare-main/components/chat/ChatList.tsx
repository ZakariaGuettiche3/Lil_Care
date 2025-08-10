"use client";
import React from "react";
import { NavItem } from "../ui/NavItem";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "../ui/avatar";
import ChatForm from "./ChatForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useApi } from "@/lib/hooks";
import { createChat } from "@/server/chat";
import { clickOn } from "@/lib/helpers";
import { toast } from "sonner";
import { ChatData, ChatInsert } from "@/types";
import { getUsers } from "@/server/users";
import clas from "@/image/Image (10).png";

type Props = {
  chats: ChatData[];
  className?: string;
  userId: string;
  role: string;
};

type ChatItemProps = ChatData & {
  active?: number;
};

const ChatItem = ({
  name,
  id,
  groupPhoto,
  active,
  lastMessageAt,
}: ChatItemProps) => {
  return (
    <>
      <NavItem
        href={`?chatId=${id}`}
        variant={id == active ? "primary" : "secondary"}
        className="py-1 h-auto px-1"
      >
        <div className="flex gap-2 hover:text-white">
          <Avatar className="w-14 h-14 rounded-full flex-shrink-0 ">
            <AvatarImage
              className="w-14 h-14 rounded-full flex-shrink-0"
              src={groupPhoto || undefined}
            />
            <AvatarFallback>
              {" "}
              <div className="w-14 h-14 bg-white rounded-full flex-shring-0"></div>{" "}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <h2>{name}</h2>
            <h4 className="text-gray-300">
              {" "}
              {format(lastMessageAt, "HH:mm")}{" "}
            </h4>
          </div>
        </div>
      </NavItem>
    </>
  );
};

export default function ChatList({ userId, chats, className, role }: Props) {
  const params = useSearchParams().get("chatId") || undefined;
  const active = parseInt(params || "");

  const usersState = useApi(getUsers, []);

  const handleSubmitChat = async (chat: {
    chat: ChatInsert;
    members: string[];
  }) => {
    const resp = await createChat(chat);
    console.log(resp);

    if (resp.length > 0) {
      toast.success("Successfully created chat");
    } else {
      toast.error("Error creating chat");
    }
    clickOn("chat-trigger-insert");
  };

  return (
    <div
      className={cn(
        "md:px-2 w-12 flex-1 md:w-64 hidden  p-2 sm:flex flex-col bg-secondary h-full gap-2",
        className
      )}
    >
      <div className="p-3 border-b">
        <h2 className="text-lg font-bold"> Chats </h2>
      </div>
      <div className="flex flex-col  h-full justify-between flex-2">
        <div className="flex flex-col gap-1">
          {chats.map((item) => (
            <ChatItem key={item.id} active={active} {...item} />
          ))}
        </div>

        {role === "ADMIN" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button id="chat-trigger-insert" variant="primary">
                + create chat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle> Create Chat </DialogTitle>
                <ChatForm
                  onSubmit={handleSubmitChat}
                  apiState={usersState?.data}
                  onClose={() => {
                    clickOn("chat-trigger-insert");
                  }}
                />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
