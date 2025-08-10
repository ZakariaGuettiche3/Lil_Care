"use client";
import { MedicalRecordForm } from "./MedicalRecordForm";
import {
  createChild,
  createMedicalRecord,
  createPsycologicalProfile,
  updateChild,
} from "@/server/children";
import { toast } from "sonner";
import { PsychologicalProfileForm } from "./PsychologicalProfileForm";
import ChildForm from "./ChildForm";
import { Children, MedicalRecordInsert } from "@/types";
import { useSessionUser } from "@/lib/hooks";
import {redirect, useRouter, useSearchParams} from "next/navigation";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "@/components/ui/tabs";
import Link from "next/link";
import Map from "@/components/map/Map";
import {PageTabs} from "@/lib/constant";

const ChildProfile = ({ child }: { child?: Children }) => {
  const { currentUser } = useSessionUser();
  const searchParams = useSearchParams();
  const router = useRouter()
  if (!currentUser) {
    return <div>loading...</div>;
  }

  if (!child) {
    return <div>loading...</div>;
  }

  const tab = searchParams.get("tab") ;
  if (!tab || !PageTabs.child.tabs.includes(tab) ){
    router.push(`${window.location.pathname}?tab=${PageTabs.child.defaultTab}`)
    return;
  }

  return (
    <div className="flex flex-col gap-3 max-w-4xl mx-auto h-screen overflow-auto">
      <Tabs defaultValue={tab}>
        <TabsList className="w-full bg-inherit">
          <TabsTrigger value="profile">
            <Link
              href={`/${currentUser.user_metadata.role?.toLowerCase()}/children/${
                child.id
              }?tab=profile`}
            >
              Profile
            </Link>
          </TabsTrigger>
          <TabsTrigger value="medical_record">Medical Record</TabsTrigger>
          <TabsTrigger value="psychological_profile">
            <Link
              href={`/${currentUser.user_metadata.role?.toLowerCase()}/children/${
                child.id
              }?tab=psychological_profile`}
            >
              Psychological Profile
            </Link>
          </TabsTrigger>
          <TabsTrigger value="location">
            <Link
              href={`/${currentUser.user_metadata.role?.toLowerCase()}/children/${
                child.id
              }?tab=location`}
            >
              Location
            </Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <ChildForm
            currentUser={currentUser}
            FormType={
              currentUser.user_metadata.role === "ADMIN" ? "update" : "read"
            }
            child={child}
            onSubmit={async (e) => {
              const res = await updateChild(e);
              console.log({ res });
              toast.success("Child was successfully created");

              setTimeout(() => {}, 2000);
              return res;
            }}
          />
        </TabsContent>
        <TabsContent value="medical_record">
          <MedicalRecordForm
            FormType={
              currentUser.user_metadata.role === "ADMIN" ? "update" : "read"
            }
            onSubmit={async (e) => {
              const res = await createMedicalRecord(e as MedicalRecordInsert);
              console.log({ res });
              if (e.childId) {
                toast.success("Medication Record was successfully updated");
              } else {
                toast.success("Medication Record was successfully created");
              }
              setTimeout(() => {}, 2000);
              return res;
            }}
            child={child}
          />
        </TabsContent>
        <TabsContent value="psychological_profile">
          <PsychologicalProfileForm
            FormType={
              currentUser.user_metadata.role === "PSYCHOLOGIST" ? "update" : "read"
            }
            onSubmit={async (e) => {
              const res = await createPsycologicalProfile(e);
              console.log({ res });
              if (e.id) {
                toast.success("Psychological Profile successfully updated");
              } else {
                toast.success("Psychological Profile successfully created");
              }
              setTimeout(() => {}, 2000);
              return res;
            }}
            child={child}
          />
        </TabsContent>
        <TabsContent value="location">
          <Map location={child.location!} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChildProfile;
