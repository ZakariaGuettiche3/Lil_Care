"use client";
import React from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex h-full">
      <Sidebar active="Events" />
      <div className="container overflow-auto">

      </div>
    </div>
  );
};

export default Page;
