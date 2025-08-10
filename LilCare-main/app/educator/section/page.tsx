import Sidebar from "@/components/Sidebar";
import React from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getSections } from "@/server/sections";
import { getChildren } from "@/server/children";

import { Button } from "@/components/ui/button";
import { getEducators } from "@/server/users";
import Sections from "@/components/cards/Sections";
import Link from "next/link";
import SectionDetails from "@/components/sections/SectionDetails";
import { supabaseServer } from "@/lib/supabase/server";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const Page = async (props: Props) => {

  const supabase = await supabaseServer();

  const sectionId =  (await supabase.auth.getSession()).data.session?.user.user_metadata.section
  const sections_id = sectionId as number | undefined;
  const educators = sections_id ? await getEducators() : [];
  const Sectionsdata = sections_id
    ? await getSections({ id: sections_id })
    : [];
  const children = sections_id
    ? await getChildren({ section: sections_id })
    : [];

  return (
    <div className="flex h-full">
      <Sidebar active="Sections" />
      <div className="container overflow-auto">
        {sectionId && (
          <SectionDetails
            section={Sectionsdata?.at(0)!}
            kids={children}
            educators={educators}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
