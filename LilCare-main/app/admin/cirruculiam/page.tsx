"use client";

import Sidebar from "@/components/Sidebar";
import ModuleForm from "@/components/curriculiam/ModuleForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useApi } from "@/lib/hooks";
import { createModule, getModules, getSeasons } from "@/server/cirriculiam";
import { Loader } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {};

function Page({}: Props) {
  const modulesState = useApi(getModules, []);


  

  return (
    <div className="flex h-full">
      <Sidebar active="Cirruculiam"  />
      <div className="container space-y-3 overflow-auto">
        <section>
       
        </section>
        <section>
          <div className="flex justify-between p-2 shadow rounded-md">
            <h2 className="text-2xl font-bold"> Modules </h2>
            <ModuleForm
              onSubmit={async (data) => {
                try {
                  console.log(data);
                  const count = await createModule(data);
                  modulesState.setData((prev) => [...(prev || []) ,...count]);
                  toast.success("Module created successfully");
                } catch (error) {
                  toast.error("something went wrong");
                }
              }}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 mt-3">
            {modulesState.data?.map((module, idx) => (
              <Card
                key={idx}
                className="grid grid-cols-3 overflow-hidden max-md:max-h-[300px]"
              >
                <img
                  className="w-full aspect-video"
                  src={module.photo}
                  alt=""
                />
                <CardContent className="pt-6 pl-2 flex-1 col-span-2">
                  <CardTitle>{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Page;
