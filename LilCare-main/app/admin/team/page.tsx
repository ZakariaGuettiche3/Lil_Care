import Sidebar from "@/components/Sidebar";
import {
  getAccountants,
  getAdmins,
  getEducators,
  getPsychologists,
  getTherapists,
  getUsers,
} from "@/server/users";

import Team from "@/components/Team";
import {PageTabs} from "@/lib/constant";
import {redirect} from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | undefined };
};
const Page = async ({ searchParams }: Props) => {
  const role = searchParams.role;
  if (!role || !PageTabs.team.tabs.includes(role) ){
    redirect(`/admin/team?role=${PageTabs.team.defaultTab}`)
    return;
  }

  const users =
    role == "admin"
      ? await getAdmins()
      : role == "educator"
      ? await getEducators()
      : role == "accountant"
      ? await getAccountants()
      : role == "psychologist"
      ? await getPsychologists()
      : role == "therapist"
      ? await getTherapists()
      : [];

  console.log(users);
  return (
    <div className="flex h-full">
      <Sidebar active="Team" />
      <div className="container main space-y-4">
        <Team searchParams = {searchParams} users={users} />
      </div>
    </div>
  );
};

export default Page;
