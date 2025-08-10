"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
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
import { Camera, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {  upsertUser } from "@/server/users";
import { postImage } from "@/lib/apis";
import { CustomImage } from "../ui/avatar";
import { CreateUserParams, JobData, ParentData, PreregistrationData, SectionData, UsersAuthSelect } from "@/types";
import { CreateUserParamsSchema } from "@/db/forms/formsSchema";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import ChildrenCard from "../ChildrenCard";
import {formatDate} from "date-fns";

type CommonProps = {
  selectedUser?: UsersAuthSelect;
  FormType?: "update" | "create";
};

type EducatorProps = {
  role: "EDUCATOR";
  jobState?: JobData[];
  sectionsState?: SectionData[];
  currentUser?: User;
};
type ParentProps = {
  role: "PARENT";
  currentUser?: User;
  preregistration?: PreregistrationData
};
type TherapistProps = {
  role: "THERAPIST";

  currentUser?: User;
};
type AccountantProps = {
  role: "ACCOUNTANT";

  currentUser?: User;
};
type AdminProps = {
  role: "ADMIN";
  currentUser?: User;
};
type PsychologistProps = {
  role: "PSYCHOLOGIST";

  currentUser?: User;
};
type Props = CommonProps &
  (
    | EducatorProps
    | ParentProps
    | TherapistProps
    | AccountantProps
    | PsychologistProps
    | AdminProps
  );

const UserForm = (props: Props) => {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<z.infer<typeof CreateUserParamsSchema>>({
    resolver: zodResolver(CreateUserParamsSchema),
    defaultValues: props.selectedUser?.rawUserMetaData
      ? { ...props.selectedUser.rawUserMetaData, id: props.selectedUser.id }
      : undefined,
  });

  useEffect(() => {
    console.log(props.selectedUser);
    console.log(form.getValues());
  }, []);

  const onSubmit = async (data: z.infer<typeof CreateUserParamsSchema>) => {
    setIsSubmitting(true);
    const userParams = {
      ...data,
      role: props.role,
      createdAt: formatDate(new Date(), "yyyy-MM-dd HH:mm:ss"),
    };
    console.log(userParams);
    try {
      if (image) {
        let imageRes = await postImage({ file: image });

        console.log(imageRes);
        
        userParams.photo = imageRes.url;
        await upsertUser(userParams as CreateUserParams);
        if (form.getValues("id")) {
          toast.success("User has been updated successfully");
        } else {
          toast.success("User has been created successfully");
        }
        return;
      }
      const response = await upsertUser(userParams as CreateUserParams);
      if (form.getValues("id")) {
        toast.success("User has been updated successfully");
      } else {
        toast.success("User has been created successfully");
      }
    } catch (error) {
      const err = error as AxiosError;
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... rest of your form logic, including the handleImage function

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.item(0);
    if (selectedFile) {
      const reader = new FileReader();
      setImage(selectedFile);
      reader.readAsDataURL(selectedFile);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const imageData = ev.target?.result as string;
        form.setValue("photo", imageData); // Store the Base64-encoded image data
      };
    }
  };

  return (
    <Form {...form}>
      <div
        className={cn({
          "flex lg:flex-col gap-2":
            props.role == "PARENT" && props?.FormType == "update",
        })}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form.getValues());
          }}
          className="space-y-6 pb-3"
        >
          {/* Common fields for all roles */}
          <FormField
            name="photo"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex items-center flex-col gap-2">
                <FormLabel className="cursor-pointer" htmlFor="photo">
                  <div className="rounded-full w-32 h-32 flex items-center justify-center border-2 border-white shadow hover:bg-opacity-70 overflow-hidden">
                    <CustomImage
                      className="rounded-full w-32 h-32 object-cover border-2 border-white shadow"
                      Alt={<Camera />}
                      src={field.value}
                    />
                  </div>
                </FormLabel>
                <FormControl className="w-full">
                  <Input
                    className="hidden"
                    id="photo"
                    type="file"
                    onChange={handleImage}
                  />
                </FormControl>
                <FormMessage />
                <div>
                  <h2 className="font-semibold text-lg">
                    {" "}
                    {(form.watch("lastName") || "Last Name") +
                      "  " +
                      (form.watch("firstName") || "First Name")}{" "}
                  </h2>
                  <h5 className="text-base text-muted-foreground">
                    @ {form.watch("username") || "username"}
                  </h5>
                </div>
              </FormItem>
            )}
          />
          <FormField
            name="cardId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                  Card ID:
                </FormLabel>
                <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) =>
                      form.setValue("cardId", parseInt(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage className="min-[400px]:col-span-4 md:col-span-5" />
              </FormItem>
            )}
          />
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                  First Name:
                </FormLabel>
                <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="min-[400px]:col-span-4 md:col-span-5" />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                  Last Name:
                </FormLabel>
                <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="min-[400px]:col-span-4 md:col-span-5" />
              </FormItem>
            )}
          />
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                  User Name:
                </FormLabel>
                <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                  <Input onChange={field.onChange} defaultValue={field.value} />
                </FormControl>
                <FormMessage className="min-[400px]:col-span-4 md:col-span-5" />
              </FormItem>
            )}
          />
          <FormField
            name="birthDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                  Birth Date:
                </FormLabel>
                <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                  <Input
                    type="date"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                  Email:
                </FormLabel>
                <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                  <Input
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {!form.getValues("id") && (
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                  <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                    Password:
                  </FormLabel>
                  <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                    <Input
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                  Phone:
                </FormLabel>
                <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                  <Input
                    type="text"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* Dynamic fields based on the role */}
          {props.role === "EDUCATOR" && (
            <>
              <FormField
                name="section"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                    <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                      Section:
                    </FormLabel>
                    <Select
                      onValueChange={(e) =>
                        form.setValue("section", parseInt(e))
                      }
                      defaultValue={`${field.value}`}
                    >
                      <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {props.sectionsState?.map((job) => (
                          <SelectItem key={job.id} value={`${job.id}`}>
                            <div className="flex justify-between">
                              <span>{job.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="min-[400px]:col-span-4 m-0">
                      don&apos;t select anything
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="job"
                render={({ field }) => (
                  <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                    <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                      Job type
                    </FormLabel>
                    <Select
                      onValueChange={(e) => form.setValue("job", parseInt(e))}
                      defaultValue={`${field.value}`}
                    >
                      <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a job" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {props.jobState?.map((job) => (
                          <SelectItem key={job.id} value={`${job.id}`}>
                            <div className="flex justify-between">
                              <span>{job.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="min-[400px]:col-span-4 m-0">
                      don&apos;t select anything
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {props.role === "THERAPIST" && (
            <FormField
              name="specialization"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                  <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                    Specialization:
                  </FormLabel>
                  <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                    <Input
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {props.role === "PSYCHOLOGIST" && (
            <FormField
              name="licenseNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                  <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                    License Number:
                  </FormLabel>
                  <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                    <Input
                      type="number"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {props.role === "ACCOUNTANT" && (
            <FormField
              name="certification"
              control={form.control}
              render={({ field }) => (
                <FormItem className="grid min-[400px]:grid-cols-6 items-center gap-2">
                  <FormLabel className="min-[400px]:col-span-2 md:col-span-1">
                    Certification:
                  </FormLabel>
                  <FormControl className="min-[400px]:col-span-4 md:col-span-5">
                    <Input
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}

          <div className="flex justify-end">
            <Button className="lowercase" type="submit">
              {isSubmitting && <Loader2 className="animate-spin" />}
              {props.FormType === "update" ? "Update" : "Create"} {props.role}
            </Button>
          </div>
        </form>
        {props?.FormType == "update" && props.role == "PARENT" && (
          <ChildrenCard params={{ parent: form.getValues("cardId") }} />
        )}
      </div>
    </Form>
  );
};

export default UserForm;
