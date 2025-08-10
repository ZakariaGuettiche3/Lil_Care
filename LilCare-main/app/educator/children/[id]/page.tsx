import Sidebar from "@/components/Sidebar";
import React from "react";
import { useApi } from "@/lib/hooks";
import {
  getChildren,
  getChildrenTable,
  getParentChildrenDetails,
} from "@/server/children";
import { ArrowLeft, Camera, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabaseServer } from "@/lib/supabase/server";
import ChildrenTable from "@/components/tables/ChildrenTable";
import ChildrenDetails from "@/components/forms/children/ChildrenDetails";
import { Button, CustomImage } from "@/components/ui";
import Link from "next/link";
import { calculateAge } from "@/lib/utils";
type Props = {
  params: { childId: string };
};
const Page = async ({ params }: Props) => {
  const supabase = await supabaseServer();

  const childId = params.childId;

  const child_id = childId
    ? typeof childId === "string"
      ? parseInt(childId)
      : undefined
    : undefined;
  console.log({ child_id });

  const childrenState = await getChildren({ id: child_id });

  const child = childrenState?.at(0);

  if (!child) {
    return <div>loading...</div>;
  }
  console.log(childrenState);
  return (
    <div className="flex h-full">
      <Sidebar active="Children" />
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 w-full p-3 border-b px-5">
          <Link href={`/admin/children/`}>
            {" "}
            <ArrowLeft />{" "}
          </Link>
          <h2 className="text-lg font-bold"> Child Profile </h2>
        </div>
        <div className="container main">
          <div className="flex w-full gap-2 justify-center items-center mt-4">
            <div className="rounded-full w-36 h-36 flex items-center justify-center border-2 border-white shadow hover:bg-opacity-70 overflow-hidden">
              <CustomImage
                className="rounded-full w-36 h-36 object-cover border-2 border-white shadow"
                src={child?.photo || undefined}
                Alt={<Camera />}
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">
                {child.firstName}{" "}
                {child.lastName}
              </h2>
              <p className="text-sm">
                {calculateAge(child.birthDate!)} years old
              </p>
            </div>
          </div>
          <ChildrenDetails child={child} />
        </div>
      </div>
    </div>
  );
};

export default Page;
