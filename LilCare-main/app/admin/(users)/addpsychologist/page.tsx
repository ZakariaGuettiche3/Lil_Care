"use client";
import React from "react";

import Sidebar from "@/components/Sidebar";

import UserForm from "@/components/forms/UserForm";

const Page = () => {


  return (
    <div className="flex h-full">
        <Sidebar active="Team"/>
      <div className="container overflow-auto">
        <UserForm role="PSYCHOLOGIST" />
      </div>
    </div>
  );
};

export default Page;
