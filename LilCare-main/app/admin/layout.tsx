import Navbar from "@/components/Navbar";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { headers } from "next/headers";
import { title } from "process";
import InitUser from "@/lib/store/InitUser";



export async function generateMetadata({
  params,
}: {
  params: Record<string, string>;
}) {
  const supabase = await supabaseServer();
  const session =     await supabase?.auth.getSession()      
  const currentUser = session?.data?.session?.user

  return {
    title: `Admin ${currentUser?.user_metadata.firstName} - ${currentUser?.user_metadata?.lastName}`,
    // title: `Admin Youcef Gagi`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await supabaseServer();
  const currentUser = (await supabase.auth.getSession()).data?.session?.user;


  const headersList = headers();
  const fullUrl = headersList.get("path");

  if (!currentUser) {
    if (fullUrl) {
       redirect("/login?path=" + fullUrl);
    }
     redirect("/login");
  }

  if (currentUser?.user_metadata.role !== "ADMIN") {
     redirect(currentUser?.user_metadata?.role?.toLowerCase());
  }

  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="">{children}</main>
      <InitUser />
    </div>
  );
}
