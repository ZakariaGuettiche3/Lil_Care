"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useApi } from "@/lib/hooks";
import { getSections } from "@/server/sections";
import { calculateAge } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { PreregestrationsSchema } from "@/db/forms/formsSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PreRegister } from "@/server/payment";
import { toast } from "sonner";


// Define the schema for preregistration form

type Props = {};

type FormSchemaData = z.infer<typeof PreregestrationsSchema>;

export default function PreregistrationForm({}: Props) {
  const [activeTab, setActiveTab] = useState<"child" | "parent">("child");

  const router = useRouter();
  const form = useForm<FormSchemaData>({
    resolver: zodResolver(PreregestrationsSchema),
    defaultValues: {
      childGender: "Male"
    }
  });

  const sectionsState = useApi(async () => {
    console.log(form.getValues("childBirthDate"));
    return await getSections({
      age: calculateAge(form.getValues("childBirthDate")),
      available: true,
    });
  }, [form.watch("childBirthDate")]);

  const onSubmit = async (data: FormSchemaData) => {
    const { data: checkout, error } = await PreRegister(data, window.location.host);
    if (checkout) {
      router.replace(checkout?.checkout_url);
    } else {
      toast.error(error);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="max-h-[90vh] flex flex-col gap-3 overflow-hidden">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">
              <img
                className="h-8 w-auto mx-auto"
                loading="lazy"
                src="https://saasproject.blob.core.windows.net/nursery/logo-light_bleu__Recovered_-removebg-preview.png?sp=r&st=2024-03-23T13:30:24Z&se=2024-08-22T21:30:24Z&spr=https&sv=2022-11-02&sr=c&sig=ITYTd0%2BKpdPMNWugtU5YRK3sL7XrpjT3eaVC78MQfwA%3D"
                alt="Your Company"
              />
            </h1>
            {/* <p className="text-balance text-muted-foreground">Welcome back</p> */}
          </div>
          <Card className="mx-auto grid w-[400] overflow-auto ">
            <CardHeader className="text-center">
              <CardTitle className="text-center">
                Preregister Your Child
              </CardTitle>
            </CardHeader>

            <Tabs value={activeTab}>
              <TabsList accessKey="" className=" w-full grid-cols-2 hidden">
                <TabsTrigger value="child"></TabsTrigger>
                <TabsTrigger
                  asChild
                  id="parentArea"
                  value="parent"
                ></TabsTrigger>
              </TabsList>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log(errors);
                  })}
                  className="space-y-2"
                >
                  {/* Parent Email Field */}
                  <TabsContent value="child">
                    <CardContent className="h-full overflow-auto">
                      <FormField
                        control={form.control}
                        name="childFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child First Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder="John"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child Last Name</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childGender"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-2 items-center">
                            <FormLabel>Child Gender</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={`Male`}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a child gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent defaultValue={"Male"}>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className=" m-0"></FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="childBirthDate"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-2 gap-2 items-center">
                            <FormLabel>Child BirthDate </FormLabel>
                            <FormControl>
                              <Input
                                value={field.value}
                                type="date"
                                placeholder="yyyy-mm-dd"
                                onChange={(e) => {
                                  form.setValue(
                                    "childBirthDate",
                                    e.target.value
                                  );
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="childSection"
                        render={({ field }) => (
                          <FormItem className="grid grid-cols-2 gap-2 items-center">
                            <FormLabel>Child Section</FormLabel>
                            <Select
                              onValueChange={(e) => form.setValue("childSection", parseInt(e))}
                              value={`${field.value}`}
                              defaultValue={
                                `${field.value}` ||
                                sectionsState.data?.at(0)?.name
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <FormControl>
                                    <SelectValue placeholder="Select a child gender" />
                                  </FormControl>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {sectionsState.data?.map((section) => (
                                  <SelectItem
                                    key={section.id}
                                    value={`${section.id}`}
                                  >
                                    <div className="flex gap-2">
                                      <img
                                        className="w-5 h-5 rounded-full"
                                        src={section.photo}
                                        alt=""
                                      />
                                      <span>{section.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                                <SelectItem value="none">
                                  No available section
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="col-span-2 m-0">
                              Please Insert Birth Date to see available sections
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>

                    <CardFooter className="justify-end">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("parent");
                        }}
                        variant={"ghost"}
                      >
                        {" "}
                        Next{" "}
                      </Button>
                    </CardFooter>
                  </TabsContent>
                  <TabsContent value="parent">
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="parentFirstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent First Name</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="parentLastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent Last Name</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="parentEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="parent@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="parentPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Parent phone</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0666666666"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab("child");
                        }}
                        variant={"ghost"}
                      >
                        {" "}
                        Back{" "}
                      </Button>
                      <Button
                        // onClick={async (e) => {
                        //   e.preventDefault();
                        //   const preRegister = await PreRegister(form.getValues())
                        //   if (preRegister) {
                        //   const checkout = await createPreregisterCheckout({
                        //     name: `${form.getValues("parentFirstName")} ${form.getValues("parentLastName")}`,
                        //     email: form.getValues("parentEmail"),
                        //     phone: form.getValues("parentPhone"),

                        //   }, {preRegister: preRegister?.id});
                        //   router.replace(checkout.checkout_url);
                        // }
                        // }}
                        variant={"ghost"}
                      >
                        {" "}
                        Next{" "}
                      </Button>
                    </CardFooter>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </Card>
        </div>
      </div>
      <div className="w-full h-full hidden lg:block">
        <img
          src="https://saasproject.blob.core.windows.net/nursery/_6eafcf6c-902d-4b78-96b4-b3aaf0c8e9f8.jpg?sp=r&st=2024-03-23T13:30:24Z&se=2024-08-22T21:30:24Z&spr=https&sv=2022-11-02&sr=c&sig=ITYTd0%2BKpdPMNWugtU5YRK3sL7XrpjT3eaVC78MQfwA%3D"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
