import Sidebar from "@/components/Sidebar";
import React from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getEvents } from "@/server/events";

// import EventDetails from "@/components/events/EventDetails";
import Link from "next/link";
import EventCard from "@/components/Events/Events";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async (props: Props) => {
  const eventId = props.searchParams.eventId;

  const events_id = eventId
    ? typeof eventId === "string"
      ? parseInt(eventId)
      : undefined
    : undefined;
  // const educators = events_id ? await getEducators(): [];
  const Eventsdata = events_id
    ? await getEvents({ id: events_id })
    : await getEvents();
  // const children = events_id ? await getChildren({event : events_id}): [];

  return (
    <div className="flex h-full">
      <Sidebar active="Events" />
      <div className="container overflow-auto">
        {
          !eventId ? (
            <section>
              <header className="bg-secondary mt-3 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Events</h2>
                  <Link
                    href="/admin/addevent"
                    className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
                  >
                    <Plus width={20} height={20} className="mr-2" />
                    New
                  </Link>
                </div>
                <form className="group relative">
                  <Search
                    width="20"
                    height="20"
                    className="absolute left-3 top-1/2 -mt-2.5 text-slate-400 pointer-events-none group-focus-within:text-blue-500"
                  />

                  <Input
                    className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6  rounded-md py-2 pl-10 ring-1 shadow-sm"
                    type="text"
                    placeholder="Search for a event..."
                  />
                </form>
              </header>

              <div className="mt-2">
                <ul className="grid grid-cols-auto gap-2">
                  {Eventsdata.map((service, id) => {
                    return <EventCard key={id} event={service} />;
                  })}
                </ul>
              </div>
            </section>
          ) : (
            <></>
          )

          //  <EventDetails event={Eventsdata?.at(0)!} children={children} educators={educators} />
        }
      </div>
    </div>
  );
};

export default Page;
