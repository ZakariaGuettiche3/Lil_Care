import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Info } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { ChatData, UserAuthData } from "@/types";

type Props = {
  chat?: ChatData;
  chatMembers?: UserAuthData[];
};

export function ChatInfo({ chat, chatMembers }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="" variant="ghost">
          {" "}
          <Info />{" "}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <div className="flex justify-center">
            <img
              className="w-32 h-32 rounded-full border border-foreground"
              src={chat?.groupPhoto || undefined}
              alt=""
            />
          </div>
          <SheetTitle> Chat Info</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-sm text-muted-foreground">
              Name
            </Label>
            <h2 className="col-span-3"> {chat?.name} </h2>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-sm text-muted-foreground">
              create At :
            </Label>
            <h2 className="col-span-3"> {chat?.createdAt.toDateString()} </h2>
          </div>
        </div>
        <SheetTitle> Chat members</SheetTitle>
        <div className="flex flex-col gap-2 mt-2">
          {chatMembers?.map((member, idx) => (
            <div key={idx} className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  className="w-10 h-10"
                  src={member?.rawUserMetaData?.photo || undefined}
                />
              </Avatar>
              <div>
                <h4> {member?.rawUserMetaData?.username} </h4>
                <h4 className="text-sm text-muted-foreground">
                  {" "}
                  {member?.rawUserMetaData?.role?.toLowerCase()}{" "}
                </h4>
              </div>
            </div>
          ))}
        </div>
        <SheetFooter>
          
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
