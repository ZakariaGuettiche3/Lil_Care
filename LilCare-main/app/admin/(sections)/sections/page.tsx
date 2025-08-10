import Sidebar from "@/components/Sidebar";
import React from "react";
import {  Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getSections } from "@/server/sections";
import { getChildren } from "@/server/children";

import { Button } from "@/components/ui/button";
import { getEducators } from "@/server/users";
import Sections from "@/components/cards/Sections";
import Link from "next/link";
import SectionDetails from "@/components/sections/SectionDetails";

type Props = {
  searchParams : { [key: string]: string | string[] | undefined };
};

const Page = async (props: Props) => {
  

  
  const sectionId = props.searchParams.sectionId;

  const sections_id = sectionId ? typeof sectionId === "string" ? parseInt(sectionId) : undefined : undefined
    const educators = sections_id ? await getEducators(): [];
    const Sectionsdata = sections_id ? await getSections({id : sections_id}): await getSections();
    const children = sections_id ? await getChildren({section : sections_id}): [];
  
  return (
    <div className="flex h-full">
      <Sidebar active="Sections"  />
      <div className="container overflow-auto">
        {!sectionId ?  <section>
          <header className="bg-secondary mt-3 space-y-4 p-4 sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6 rounded-lg">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Sections</h2>
                <Link href="/admin/addsection" className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm">
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
                placeholder="Search for a section..."
              />
            </form>
          </header>

          <Sections sections={Sectionsdata} />
        </section>
       : <SectionDetails kids={children} section={Sectionsdata?.at(0)!}  educators={educators} />
      
      }
      </div>
    </div>
  );
};

export default Page;
