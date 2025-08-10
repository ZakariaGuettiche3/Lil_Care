"use client";
import React from "react";
import SectionsForm from "@/components/forms/SectionForm";
import Sidebar from "@/components/Sidebar";
import { createSection } from "@/server/sections";
import { toast } from "sonner";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex h-full">
      <Sidebar active="Sections" />
      <div className="container overflow-auto">
        <SectionsForm
          onSubmit={async (data) => {
            const { error , data: res} = await createSection(data);
            if (error) {
              toast.error(`${error}`);
              return;
            }
            toast.success("Section created successfully");
          }}
        />
      </div>
    </div>
  );
};

export default Page;
