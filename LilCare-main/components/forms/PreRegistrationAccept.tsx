"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { format, formatDate } from "date-fns";
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
import { Camera, Check, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ApiState, useApi, usePreregistrationTable } from "@/lib/hooks";
import { createUser, upsertUser } from "@/server/users";
import { postImage } from "@/lib/apis";
import { Avatar, AvatarFallback, AvatarImage, CustomImage } from "../ui/avatar";
import {
  CreateUserParams,
  JobData,
  ParentData,
  PreregistrationData,
  SectionData,
  UserAuthData,
  UsersAuthSelect,
} from "@/types";
import {
  CreateUserParamsSchema,
  PreRegistrationAcceptSchema,
} from "@/db/forms/formsSchema";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import ChildrenCard from "../ChildrenCard";
import { log } from "console";
import { getCustomers } from "@/server/payment";
// Import your Zod schemas

type Props = {
    onSubmit?: (data: z.infer<typeof PreRegistrationAcceptSchema>) => void
    onCancel?: () => void

};

const PreRegistrationAccept = ({onSubmit, onCancel}: Props) => {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const PreRgistrationAction = usePreregistrationTable(
    (state) => state?.ActionRow!
  );

  const { parentPhone, parentEmail, parentLastName, parentFirstName } =
    PreRgistrationAction;

  const customerState = useApi(
    async () =>
      await getCustomers({ email: PreRgistrationAction?.parentEmail! }),
    [PreRgistrationAction]
  );

  const form = useForm<z.infer<typeof PreRegistrationAcceptSchema>>({
    resolver: zodResolver(PreRegistrationAcceptSchema),
    defaultValues: {
      firstName: parentFirstName,
      lastName: parentLastName,
      phone: parentPhone,
      role: "PARENT",
      email: parentEmail,
      customerId: customerState.data?.at(0)?.id,
      child: {
        firstName: PreRgistrationAction.childFirstName,
        lastName: PreRgistrationAction.childLastName,
        birthDate: PreRgistrationAction.childBirthDate,
        section: PreRgistrationAction.childSection,
        gender: PreRgistrationAction.childGender || "Male",
      },
    },
  });

  useEffect(() => {
    console.log(form.getValues());
  }, []);

  const checkSubmit = async (
    data: z.infer<typeof PreRegistrationAcceptSchema>
  ) => {
    setIsSubmitting(true);

    try {
      if (image) {
        let imageRes = await postImage({ file: image });
        form.setValue("photo", imageRes.url);
      }
      onSubmit?.(data)
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
      <div className={"flex lg:flex-col gap-2"}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkSubmit(form.getValues());
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
          {
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
          }
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

          <div className="flex gap-3 justify-end">
            <Button type = "button" variant={"outline"} onClick={(e) => {onCancel?.()}}> Cancle </Button>
            <Button className="lowercase" type="submit">
              {isSubmitting && <Loader2 className="animate-spin" />}
              Accept
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default PreRegistrationAccept;
