import React from "react";

import Sidebar from "@/components/Sidebar";

import UserForm from "@/components/forms/UserForm";
import { getPreregistrations } from "@/server/preregistrations";

type Props = {
searchParams: { [key: string]: string  | undefined };
}
const Page = ({searchParams} : Props) => {

  const id = searchParams.id ? parseInt(searchParams.id) : undefined;

  const preregistration = id ? getPreregistrations({id: id}) : undefined;
  return (
    <div className="flex h-full">
        <Sidebar active="Team"/>
      <div className="container overflow-auto">
        {
          preregistration ? (
            <UserForm role="PARENT" FormType="update" />
          ) : (
            <h1>Preregistration not found</h1>
          )
        }
        
      </div>
    </div>
  );
};

export default Page;
