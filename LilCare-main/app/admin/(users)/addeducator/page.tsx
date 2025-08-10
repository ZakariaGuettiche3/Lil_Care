"use client";
import React from "react";

import Sidebar from "@/components/Sidebar";

import UserForm from "@/components/forms/UserForm";
import { useApi } from "@/lib/hooks";
import { getJobs, getSections } from "@/server/sections";

const Page = () => {

  const jobState = useApi(getJobs,[])
  const sectionsState = useApi(getSections,[])

  return (
    <div className="flex h-full">
        <Sidebar active="Team"/>
      <div className="container overflow-auto">
        <UserForm jobState={jobState?.data} sectionsState={sectionsState?.data} role="EDUCATOR" />
      </div>
    </div>
  );
};

export default Page;
