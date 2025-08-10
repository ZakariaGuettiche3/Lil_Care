"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormField,
  FormItem,
  FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { childInsertSchema } from "@/db/forms/formsSchema";
import { z } from "zod";
import { ArrowLeft, Camera, Edit, Loader2 } from "lucide-react";
import { getSections } from "@/server/sections";
import { CustomImage } from "@/components/ui/avatar";
import { postImage } from "@/lib/apis";
import { Children } from "@/types";
import { useApi } from "@/lib/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getParents } from "@/server/users";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { calculateAge } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

const formSchema = childInsertSchema;
type FormData = z.infer<typeof formSchema>;

type ReadFormProps = {
  FormType: "read";
  child?: Children;
  currentUser: User

};
type UpdateFormProps = {
  FormType: "update";
  child?: Children;
  currentUser: User
  onSubmit?: (data: FormData) => Promise<FormData>;
};
type CreateFormProps = {
  FormType: "create";
  currentUser: User
  onSubmit?: (data: FormData) => Promise<FormData>;
};

type Props = ReadFormProps | UpdateFormProps | CreateFormProps;

export default function ChildForm<T>(props: Props) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(
    false || props.FormType == "create"
  );

  const router = useRouter();

  const child =
    props.FormType !== "create"
      ? {
          ...props.child,
          section: props.child?.section.id,
          parent: props.child?.parent.cardId,
        }
      : { firstName: "", lastName: "", birthDate: "", gender: "Male" };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema), // Use Zod resolver for validation
    defaultValues: child as z.infer<typeof formSchema>,
  });

  const [image, setImage] = useState<File>();

  const parentsState = useApi(getParents, []);

  const sectionsState = useApi(
    async () =>
      calculateAge(form.getValues("birthDate"))
        ? await getSections({ age: calculateAge(form.getValues("birthDate")) })
        : [],
    [form.watch("birthDate")]
  );

  const checkSubmit = async (data: FormData) => {
    // Handle form Last Check before submission  logic here
    // e.g., send POST request to your API endpoint to add the parent to the database
    setSubmitting(true);
    if (props.FormType !== "read") {
      if (image) {
        console.log(data);
        let imageRes = await postImage({ file: image });
        data.photo = imageRes.url;
        props.onSubmit?.(data);
        return;
      }
      props.onSubmit?.(data);
    }
    setSubmitting(false);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Handle image called");
    const selectedFile = e.target?.files?.item(0);
    if (selectedFile) {
      const reader = new FileReader();
      setImage(selectedFile);
      reader.readAsDataURL(selectedFile);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const imageData = ev.target?.result as string;
        console.log("imageData: ", imageData);
        form.setValue("photo", imageData); // Store the Base64-encoded image data
      };
    }
  };

  return (
    <Form {...form}>
      <Card className="mt-2">
        <CardHeader className="flex flex-row justify-between items-center border-b py-2">
          
          <h2 className="text-lg font-semibold">General Informations</h2>
          {props.FormType == "update" && (
            <Button
              variant={"outline"}
              onClick={(e) => {
                setEditable(true);
              }}
              size={"icon"}
            >
              <Edit />
            </Button>
          )}
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkSubmit(form.getValues());
          }}
        >
          <CardContent className="flex flex-col gap-3">
            {props.FormType == "create" && <FormField
              name="photo"
              defaultValue=""
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex gap-3 items-center">
                  <FormLabel
                    className="col-span-2  leading-10 cursor-pointer"
                    htmlFor="photo"
                  >
                    <div className="rounded-full w-32 h-32 flex items-center justify-center border-2 border-white shadow hover:bg-opacity-70 overflow-hidden">
                      <CustomImage
                        className="rounded-full w-32 h-32 object-cover border-2 border-white shadow"
                        src={field?.value || undefined}
                        Alt={<Camera />}
                      />
                    </div>
                  </FormLabel>
                  <FormControl className="">
                    {editable && (
                      <Input
                        className="hidden"
                        id="photo"
                        defaultValue={""}
                        type="file"
                        onChange={handleImage}
                      />
                    )}
                  </FormControl>
                  <div className="col-span-3 md:col-span-4 col-start-3 md:col-start-2">
                    <h2 className="font-semibold text-lg">
                      {" "}
                      {(form.watch("lastName") || "Last Name") +
                        "  " +
                        (form.watch("firstName") || "First Name")}{" "}
                    </h2>
                    <h5 className="text-base text-muted-foreground">
                      {" "}
                      {sectionsState.data?.find(
                        (value) => value.id == form.watch("section")
                      )?.name || "section"}
                    </h5>
                  </div>
                </FormItem>
              )}
            />}
            <FormField
              name="firstName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center mt-2">
                  <FormLabel className="col-span-2  leading-10">
                    First Name :{" "}
                  </FormLabel>
                  <FormControl className="col-span-4 ">
                    {editable ? (
                      <Input placeholder="Enter first name" {...field} />
                    ) : (
                      <Label className="leading-10">
                        {" "}
                        {field.value || "None"}{" "}
                      </Label>
                    )}
                  </FormControl>
                  {editable && (
                    <FormDescription className="col-span-5">
                      This is the first name of the child.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2  leading-10">
                    Last Name :{" "}
                  </FormLabel>
                  <FormControl className="col-span-4 ">
                    {editable ? (
                      <Input placeholder="Enter last name" {...field} />
                    ) : (
                      <Label className="leading-10">
                        {" "}
                        {field.value || "None"}{" "}
                      </Label>
                    )}
                  </FormControl>
                  {editable && (
                    <FormDescription className="col-span-5">
                      This is the last name of the child.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="birthDate"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2  leading-10">
                    Birth Date :{" "}
                  </FormLabel>
                  <FormControl className="col-span-4 ">
                    {editable ? (
                      <Input
                        type="date"
                        value={field.value}
                        onChange={(e) => {
                          form.setValue("birthDate", e.target.value);
                        }}
                      />
                    ) : (
                      <FormControl className="col-span-4 ">
                        <Label className="leading-10">
                          {" "}
                          {field.value || "None"}{" "}
                        </Label>
                      </FormControl>
                    )}
                  </FormControl>
                  {editable && (
                    <FormDescription className="col-span-5">
                      Please select the birth date of the child.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2  leading-10">
                    Child Gender :{" "}
                  </FormLabel>

                  {editable ? (
                    <Select
                      value={field.value}
                      onValueChange={(e) =>
                        form.setValue("gender", e as "Male" | "Female")
                      }
                      defaultValue={`Male`}
                    >
                      <FormControl className="col-span-4 ">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a child gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent defaultValue={"Male"}>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl className="col-span-4 ">
                      <Label className="leading-10">
                        {" "}
                        {field.value || "None"}{" "}
                      </Label>
                    </FormControl>
                  )}
                  {editable && (
                    <FormDescription className=" m-0"></FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2  leading-10">
                    Section :{" "}
                  </FormLabel>

                  {editable ? (
                    <Select
                      value={`${field.value}`}
                      onValueChange={(e) => {
                        form.setValue("section", parseInt(e));
                      }}
                    >
                      <FormControl className="col-span-4 ">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a child Section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sectionsState.data?.map((section, id) => (
                          <SelectItem
                            className="flex flex-row gap-2 w-full"
                            key={id}
                            value={`${section.id}`}
                          >
                            <CustomImage
                              src={section?.photo}
                              alt={section.name}
                            />
                            <p> {section?.name}</p>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <FormControl className="col-span-4 ">
                      <Label className="leading-10">
                        {" "}
                        {sectionsState?.data?.find(
                          (section) => section.id === field.value
                        )?.name || "None"}{" "}
                      </Label>
                    </FormControl>
                  )}
                  {editable && (
                    <FormDescription className="col-span-5">
                      This is the section of the child.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2  leading-10">
                    Parent :{" "}
                  </FormLabel>
                  {editable ? (
                    <Select
                      value={`${field.value}`}
                      onValueChange={(e) => {
                        form.setValue("parent", parseInt(e));
                      }}
                    >
                      <FormControl className="col-span-4 ">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a child Section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parentsState?.data?.map((parent, id) => (
                          <SelectItem
                            className="flex flex-row gap-2 w-full"
                            key={id}
                            value={`${parent?.rawUserMetaData?.cardId}`}
                          >
                            <CustomImage
                              src={parent?.rawUserMetaData?.photo}
                              alt={parent?.rawUserMetaData?.firstName}
                            />
                            <p> {parent?.rawUserMetaData?.firstName}</p>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Label className="leading-10">
                      {" "}
                      {parentsState?.data?.find(
                        (parent) =>
                          parent?.rawUserMetaData?.cardId == field.value
                      )?.rawUserMetaData?.firstName || "None"}{" "}
                    </Label>
                  )}
                  {editable && (
                    <FormDescription className="col-span-5">
                      This is the parent of the child.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
          name="parentId"
          render={({ field }) => (
            <FormItem className="grid grid-cols-6 items-center">
              <div className="flex gap-3 items-center">
                <FormLabel className="col-span-2  leading-10">Parent ID</FormLabel>
                <FormControl className="col-span-4 ">
                  <Switcher
                    selected={defaultParent}
                    onChosen={(e) => {
                      console.log(e?.rawUserMetaData?.cardId);
                      form.setValue("parent", e?.rawUserMetaData?.cardId!);
                    }}
                    values={Parentcommands}
                  />
                </FormControl>
              </div>

              {editable &&  <FormDescription className = "col-span-5">
                This is the parent ID of the child.
              </FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        /> */}
          </CardContent>
          {editable && (
            <CardFooter className="flex gap-2 justify-end">
              <Button
                variant={"outline"}
                onClick={(e) => {
                  setEditable(false);
                }}
              >
                {" "}
                Cancel{" "}
              </Button>
              <Button type="submit">
                {" "}
                {submitting && <Loader2 className="animate-spin" />} Submit
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </Form>
  );
}
