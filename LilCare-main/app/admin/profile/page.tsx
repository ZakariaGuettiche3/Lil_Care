import Sidebar from "@/components/Sidebar";
import { supabaseServer } from "@/lib/supabase/server";
import React from "react";
import UserForm from "@/components/forms/UserForm";
import { UserToUserAuthSelect } from "@/lib/utils";

type Props = {};

export default async function Page({}: Props) {
    const supabase = await supabaseServer();

    const currentUser = (await supabase.auth.getSession()).data?.session?.user;

    return (
        <div className="flex gap-3 h-full">
            <Sidebar active="Profile" />
            <div className="container main p-4">
                <UserForm
                    role="ADMIN"
                    FormType="update"
                    currentUser={currentUser || undefined}
                    selectedUser={UserToUserAuthSelect(currentUser)}
                />
            </div>
        </div>
    );
}
