"use client"
import { UsersAuthSelect } from "@/types";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "@radix-ui/react-label";
import { CalendarDays } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import UserProfileForm from "./UserProfileForm";
import { UserToUserAuthSelect } from "@/lib/utils";

type Props =
  | { currentUser?: User; selectedUser: undefined }
  | { selectedUser?: UsersAuthSelect; currentUser: undefined };

function UserDetails({ currentUser, selectedUser }: Props) {
  const [user, setUser] = useState<UsersAuthSelect>();

  useEffect(() => {
    if (currentUser) {
      setUser(UserToUserAuthSelect(currentUser));
    } else {
      setUser(selectedUser);
    }
  }, [currentUser, selectedUser]);
  return (
    <div className = "w-full">
      {" "}
      <header>
        {/* <div className="w-full rounded-md aspect-[50/9] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" /> */}
        <div className="flex gap-2 px-4">
          <Avatar className="w-28 aspect-square rounded-full ">
            <AvatarImage src={user?.rawUserMetaData?.photo} />
            <AvatarFallback>
              {" "}
              <div className="w-14 h-14 bg-white rounded-full flex-shring-0"></div>{" "}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col pt-3">
            <h2 className="font-bold text-lg">
              {" "}
              {user?.rawUserMetaData?.lastName +
                " " +
                user?.rawUserMetaData?.firstName}{" "}
            </h2>
            <h4 className="text-card-foreground leading-none mb-auto">
              {" "}
              parent{" "}
            </h4>
            <div className="flex gap-2 items-center">
              <CalendarDays />

              <h4 className="text-card-foreground leading-none">
                Joined {new Date(user?.createdAt!).toDateString()}{" "}
              </h4>
            </div>
          </div>
        </div>
      </header>
      <div className="main mt-6 grid lg:grid-cols-6 space-y-4 lg:space-y-0 lg:space-x-2">
        <article className="space-y-4 lg:col-span-4 lg:pr-0 pb-0">
          <section>
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-lg"> Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-8">
                <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
                  <div className="flex flex-col space-y-2 col-span-4 justify-center">
                    <Label className="text-md"> Username </Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      disabled
                      value={user?.rawUserMetaData?.username}
                      placeholder=""
                    />
                  </div>
                  {/* <Label className="text-md"> {currentUser?.user_metadata.username} </Label> */}
                </div>
                <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
                  <div className="flex flex-col space-y-2 col-span-4 justify-center">
                    <Label className="text-md"> Email </Label>
                  </div>
                  <div className="col-span-8">
                    <Input
                      value={user?.rawUserMetaData?.email}
                      placeholder=""
                    />
                  </div>
                  {/* <Label className="text-md"> {currentUser?.user_metadata.username} </Label> */}
                </div>
              </CardContent>
            </Card>
          </section>
          <section>
            <UserProfileForm currentUser={user} />
          </section>
        </article>

      </div>
    </div>
  );
}

export default UserDetails;
