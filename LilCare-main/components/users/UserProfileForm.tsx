"use client"
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UsersAuthSelect } from "@/types";

type Props = {
  currentUser?: UsersAuthSelect;
};

function UserProfileForm({ currentUser }: Props) {
    const [allowEditing ,setAllowEditing ] = useState(false)
   return (
    <Card className="pb-0">
      <CardHeader className="border-b flex justify-between flex-row items-center">
        <CardTitle className="text-lg">Profile Information</CardTitle>
        <div className="flex gap-2">
          <Button
            onClick={(e) => { 
                setAllowEditing(true);
            }}
          variant={"outline"} size={"icon"}>
            <Pencil />
          </Button>
          <AddData
            onSubmit={async (data) => {
              //   const res = await supabase.auth.updateUser({
              //     data: { ...currentUser?.user_metadata, ...data },
              //   });
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-8">
        <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
          <div className="flex flex-col space-y-2 col-span-4 justify-center">
            <Label className="text-md"> First name </Label>
          </div>
          <div className="col-span-6">
            <Input
              disabled = {!allowEditing}
              value={currentUser?.rawUserMetaData?.firstName}
              placeholder=""
            />
          </div>
          {/* <Label className="text-md"> {currentUser?.user_metadata.username} </Label> */}
        </div>
        <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
          <div className="flex flex-col space-y-2 col-span-4 justify-center">
            <Label className="text-md"> Last name </Label>
          </div>
          <div className="col-span-8">
            <Input
              disabled = {!allowEditing}
              value={currentUser?.rawUserMetaData?.lastName}
              placeholder=""
            />
          </div>
          {/* <Label className="text-md"> {currentUser?.user_metadata.username} </Label> */}
        </div>
        <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
          <div className="flex flex-col space-y-2 col-span-4 justify-center">
            <Label className="text-md"> Phone </Label>
          </div>
          <div className="col-span-8">
            <Input
              disabled = {!allowEditing}
              value={currentUser?.phone || ""}
              placeholder=""
            />
          </div>
          {/* <Label className="text-md"> {currentUser?.user_metadata.username} </Label> */}
        </div>
        <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
          <div className="flex flex-col space-y-2 col-span-4 justify-center">
            <Label className="text-md"> Card Id </Label>
          </div>
          <div className="col-span-8">
            <Input
              disabled = {!allowEditing}
              value={currentUser?.rawUserMetaData?.cardId}
              placeholder=""
            />
          </div>
          {/* <Label className="text-md"> {currentUser?.user_metadata.username} </Label> */}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 flex-row items-center border-t bg-muted/50 px-6 py-3">
        <Button size={"sm"} variant={"outline"}>
          {" "}
          Cancel{" "}
        </Button>

        <Button disabled = {!allowEditing} size={"sm"} variant={"primary"}>
          {" "}
          Save{" "}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default UserProfileForm;

export function AddData({
  onSubmit,
}: {
  onSubmit?: ({ key }: { key: string }) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger id="add_data_trigger" asChild>
        <Button size={"sm"}> Add data </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Key
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Value
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

