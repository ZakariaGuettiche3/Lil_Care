import Navbar from "@/components/Navbar";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { headers } from "next/headers";
import InitLocation from "@/lib/store/InitLocation";


export async function generateMetadata({
  params,
}: {
  params: Record<string, string>;
}) {
  const supabase = await supabaseServer();
  const currentUser = (await supabase.auth.getUser()).data?.user;
  return {
    title: `Educator ${currentUser?.user_metadata.firstName} - ${currentUser?.user_metadata?.lastName}`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await supabaseServer()
  const currentUser = (await supabase.auth.getUser()).data?.user;

  const headersList = headers();
  const fullUrl = headersList.get("path");

  if (!currentUser) {
    if (fullUrl) {
       redirect("/login?path=" + fullUrl);
    }
     redirect("/login");
  }

  if (currentUser?.user_metadata.role !== "EDUCATOR") {
    return redirect(currentUser?.user_metadata.role.toLowerCase());
  }

  return (
    <div className="flex flex-1 flex-col h-screen overflow-hidden">
      <Navbar />

      <main className="">{children}</main>
      <InitLocation section={currentUser.user_metadata.section} />
    </div>
  );
}
