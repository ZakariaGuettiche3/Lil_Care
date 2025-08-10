"use client";
import React from "react";

import Sidebar from "@/components/Sidebar";

import UserForm from "@/components/forms/UserForm";

const Page = () => {


  return (
    <div className="flex h-full">
      <Sidebar active="Parents" />
      <div className="container overflow-auto">
        <UserForm role="PARENT" />
      </div>
    </div>
  );
};

export default Page;
