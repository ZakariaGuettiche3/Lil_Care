"use client";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";
import { ModeButton } from "./ui/theme-button";
import { UserHoverCard } from "./users/UserHoverCard";
import { clickOn } from "@/lib/helpers";
import Notifications from "./notifications/Notifications";
import { User } from "@supabase/supabase-js";
import { useApi } from "@/lib/hooks";
import { getNotifications } from "@/server/notifications";
import { logoutServer } from "@/server/users";

type Props = {

  currentUser? : User
};



const Navbar = ({ currentUser }: Props) => {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    await logoutServer();
    router.replace("/login");
  };


  return (
    <div className="w-screen pl-2 bg-secondary h-16 px-4 flex items-center">
      <Button size={"sm"} className="min-[400px]:hidden rounded-full" variant={"secondary"} onClick={(e) => {clickOn("sidebar-trigger")}}>
        <MenuIcon />
      </Button>
      <div className="flex flex-shrink-0 items-center md:w-64 justify-center">
        <img
          className="h-8 w-auto mx-2"
          loading="lazy"
          src="https://saasproject.blob.core.windows.net/nursery/logo-light_bleu__Recovered_-removebg-preview.png?sp=r&st=2024-03-23T13:30:24Z&se=2024-08-22T21:30:24Z&spr=https&sv=2022-11-02&sr=c&sig=ITYTd0%2BKpdPMNWugtU5YRK3sL7XrpjT3eaVC78MQfwA%3D"
          alt="Your Company"
        />
      </div>
      <nav className="bg-secondary flex-1">
        <div className="mx-auto max-w-7xl px-2 sm:pl-6 lg:pl-8">
          <div className="relative flex h-16 items-center justify-end">
            {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="absolute -inset-0.5"></span>
                <span className="sr-only">Open main menu</span>
              </button>
            </div> */}
            
            {/* <Notifications  currentUser={currentUser} /> */}
            <UserHoverCard handleLogout = {handleLogout} />
              <ModeButton   />
            <Button className="hidden sm:block" onClick={handleLogout}> Logout </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;






