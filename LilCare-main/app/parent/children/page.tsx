import Sidebar from "@/components/Sidebar";
import React from "react";
import { getChildren } from "@/server/children";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabaseServer } from "@/lib/supabase/server";
import ChildrenDetails from "@/components/forms/children/ChildrenDetails";
import ChildCard from "@/components/cards/ChildCard";
type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
const Page = async (props: Props) => {


  
  const supabase = await supabaseServer()

  const childId = props.searchParams.childId;
 

  const child_id = childId
    ? typeof childId === "string"
      ? parseInt(childId)
      : undefined
    : undefined;
    console.log({child_id});

    const childrenState = child_id ? await getChildren({id : child_id}) : await getChildren()
  console.log(childrenState);
  return (
    <div className="flex h-full">
      <Sidebar active="Children"  />
      <div className="container main">
        {!childId ? (
          <section>
            <header className="bg-secondary mt-3 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 rounded-lg">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Children</h2>
                <a
                  href="/admin/addchild"
                  className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
                >
                  <Plus width={20} height={20} className="mr-2" />
                  New
                </a>
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
                  placeholder="Search for a section..."
                />
              </form>
            </header>

            <div className="mt-3">
              {childrenState?.length > 0 ? ( childrenState?.map((child, idx) => (
                <ChildCard key={idx}  child={child} />
              )) ) : ( <p>No children found</p> )}
            </div>
          </section>
        ) : (
          <ChildrenDetails child={childrenState?.at(0)} />
        )}
      </div>
    </div>
  );
};

export default Page;
