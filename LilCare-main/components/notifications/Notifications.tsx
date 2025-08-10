"use client";
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenuShortcut,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
 
} from "@/components/ui/dropdown-menu";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useApi, useNotificationsTable } from "@/lib/hooks";
import { NotificationData } from "@/types";
import { User } from "@supabase/supabase-js";
import { Badge } from "../ui/badge";
import { getNotifications } from "@/server/notifications";
import { CircleDollarSign, LucideMessageSquare, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Props = {
  currentUser?: User;
};

function Notifications({ currentUser }: Props) {
  const { data : notifications, addRow } = useNotificationsTable(
    (state) => state
  );

  const supabase = supabaseBrowser();

  const { data: initNotifications } = useApi(getNotifications, []);

  useEffect(() => {
    if (initNotifications instanceof Array) {
      useNotificationsTable.setState((state) => ({ data: initNotifications }));
      console.log({ initNotifications });

      const channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notification" },
          async (payload) => {
            addRow(payload.new as NotificationData);
            console.log({ newNotification: payload.new });
            if (payload.new.receipent?.id !== currentUser?.id) {
              const audio = document.getElementById?.("a1") as HTMLAudioElement;
            }
          }
        )
        .subscribe();
    }
  }, [initNotifications]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="rounded-full relative aspect-square p-2"
          variant="secondary"
        >
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {notifications?.length > 0 && (
            <Badge
              className="absolute top-0 right-0 px-1"
              variant={"destructive"}
            >
              {" "}
              {notifications.length}{" "}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-[400px] overflow-auto">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup></DropdownMenuGroup>
        {notifications?.map((notification) => (
          <DropdownMenuItem
            className="flex gap-2 items-center relative"
            key={notification.id}
          >
            <Avatar className="rounded-full aspect-square w-12 bg-blue-500 text-white">
              <AvatarImage src={notification.photo || undefined} />
              <AvatarFallback
                className={cn({
                  "bg-blue-500": notification.type == "invoice_created",
                  "bg-green-500": notification.type == "message",
                })}
              >
                {notification.type == "invoice_created" && <CircleDollarSign />}
                {notification.type == "message" && <LucideMessageSquare />}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h4 className="text-md">{notification.message} </h4>
              <p className="text-current/80">
                {" "}
                {format(notification.created_at, "yyyy-MM-dd")}{" "}
              </p>
            </div>
            <Button className="absolute p-1 rounded-full border-none w-6 h-6 top-3 right-0" variant={"outline"} ><XCircle /> </Button>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Notifications;
