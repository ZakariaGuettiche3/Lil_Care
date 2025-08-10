import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "date-fns";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useApi } from "@/lib/hooks";
import { Separator } from "../ui/separator";

type Props = {
  handleLogout: () => void;
};
export function UserHoverCard(props: Props) {
  const user = useApi(() => supabaseBrowser().auth.getUser(), []).data?.data
    .user;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button className="flex-shrink-0" variant="link">
          <Avatar className="flex-shrink-0 rounded-full aspect-square w-8 h-8">
            <AvatarImage src={user?.user_metadata.photo} />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-2">
          <Avatar className="flex-shrink-0 rounded-full aspect-square w-12 h-12">
            <AvatarImage src={user?.user_metadata.photo} />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              {user?.user_metadata.username}
            </h4>
            <p className="text-sm">{user?.user_metadata.role}</p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined {user ? format(user.created_at!, "MM yyyy") : "MM yyyy"}
              </span>
            </div>
          </div>
        </div>
        <div className="sm:hidden">
          <Separator className="my-3" />
          <div className="flex justify-end">
            <Button
              size={"sm"}
              onClick={(e) => {
                props.handleLogout();
              }}
            >
              Log out
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
