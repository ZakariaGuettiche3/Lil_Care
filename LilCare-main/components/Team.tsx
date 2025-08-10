"use client";
import ParentsTable from "@/components/tables/ParentsTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { UsersAuthSelect } from "@/types";

type Props = {
  searchParams: { [key: string]: string | undefined };
  users?: UsersAuthSelect[];
};
const page = ({ searchParams, users }: Props) => {
  const role = searchParams.role;

  console.log(users);
  return (
    <Tabs defaultValue={role}>
      <TabsList className="bg-inherit w-full overflow-x-auto flex justify-center mt-3">
        <TabsTrigger value="admin">
          <Link
            href="/admin/team?role=admin"
            className="group flex items-center rounded-md  text-sm font-medium pl-2 pr-3 py-2 "
          >
            <span>Admins</span>
            <svg
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              />
            </svg>
          </Link>
        </TabsTrigger>
        <TabsTrigger
          className="group flex items-center rounded-md  text-sm font-medium pl-2 pr-3 py-2 "
          value="educator"
        >
          <Link
            href="/admin/team?role=educator"
            className="group flex items-center rounded-md  text-sm font-medium pl-2 pr-3 py-2 "
          >
            <span>Educators</span>
            <svg
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              />
            </svg>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="accountant">
          <Link
            href="/admin/team?role=accountant"
            className="group flex items-center rounded-md  text-sm font-medium pl-2 pr-3 py-2 "
          >
            <span>Accountants</span>
            <svg
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              />
            </svg>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="psychologist">
          <Link
            href="/admin/team?role=psychologist"
            className="group flex items-center rounded-md text-sm font-medium pl-2 pr-3 py-2 "
          >
            <span>Psychologists</span>
            <svg
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              />
            </svg>
          </Link>
        </TabsTrigger>
        <TabsTrigger value="therapist">
          <Link
            href="/admin/team?role=therapist"
            className="group flex items-center rounded-md  text-sm font-medium pl-2 pr-3 py-2 "
          >
            <span>Therapists</span>
            <svg
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              />
            </svg>
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="admin">
        {role == "admin" && <ParentsTable title="Admins" apiState={users} />}
      </TabsContent>
      <TabsContent value="educator">
        {role == "educator" && (
          <ParentsTable title="Educators" apiState={users} />
        )}
      </TabsContent>
      <TabsContent value="accountant">
        {role == "accountant" && (
          <ParentsTable title="Accountants" apiState={users} />
        )}
      </TabsContent>
      <TabsContent value="psychologist">
        {role == "psychologist" && (
          <ParentsTable title="Psychologists" apiState={users} />
        )}
      </TabsContent>
      <TabsContent value="therapist">
        {role == "therapist" && (
          <ParentsTable title="Therapists" apiState={users} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default page;
