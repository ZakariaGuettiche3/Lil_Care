"use client";
import { z } from "zod";
import { childInsertSchema } from "@/db/forms/formsSchema";
import Sidebar from "@/components/Sidebar";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { createChild } from "@/server/children";
import { AxiosError } from "axios";
import ChildForm from "@/components/forms/children/ChildForm";
import { useSessionUser } from "@/lib/hooks";

const onSubmit = async (data: z.infer<typeof childInsertSchema>) => {
  try {
    const response = await createChild(data);
    console.log(response);
    toast.success("Child created successfully");
    console.log("child created successfully");
  } catch (error) {
    const err = error as AxiosError;
    toast.error(<p className="text-red-400">{err.message}</p>);
  }
  return data;
};
// Define the schema for the form
// Create the ProfileForm component
export default function ProfileForm() {
  const { currentUser } = useSessionUser();
  

  return (
    <div className="flex h-full">
      <Sidebar active="Children" />
      <div className="container overflow-auto">
        <ChildForm
          currentUser={currentUser!}
          FormType="create"
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
