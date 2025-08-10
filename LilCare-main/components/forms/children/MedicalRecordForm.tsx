"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
} from "@/components/ui/select";
import { MedicalRecordSchema } from "@/db/forms/formsSchema";

import { SelectValue } from "@radix-ui/react-select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Children, MedicalRecordData, MedicalRecordInsert } from "@/types";

const formSchema = MedicalRecordSchema;
type FormData = z.infer<typeof formSchema>;

type ReadFormProps = {
  FormType: "read";
  child?: Children;
};
type UpdateFormProps = {
  FormType: "update";
  child?: Children;
  onSubmit?: (data: FormData) => Promise<any>;
};
type CreateFormProps = {
  FormType: "create";
  onSubmit?: (data: FormData) => Promise<any>;
};

type Props = ReadFormProps | UpdateFormProps | CreateFormProps;

export function MedicalRecordForm(props: Props) {
  const [editable, setEditable] = useState<boolean>(
    false || props.FormType == "create"
  );
  const medicalRecord =
    props.FormType !== "create"
      ? props.child?.medicalRecord
      : {
          drugs: [],
          allergies: [],
          specificCare: "",
          previousDiseases: [],
          healthNotice: "",
          specialDiet: "",
          bloodGroup: "A+",
          otherNotice: "",
          childId: 0,
        };

  const form = useForm<FormData>({
    resolver: zodResolver(MedicalRecordSchema),
    defaultValues: medicalRecord as FormData,
  });

  function checkSubmit(data: FormData) {
    console.log({ data });
    if (props.FormType !== "read") {
      
      const res = props?.onSubmit?.(data as FormData);
      if (res) {
        setEditable(false);
      }
      setEditable(false);
    }
  }

  return (
    <Form {...form}>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className=""> Medical Record </CardTitle>
          <Button
            variant={"outline"}
            onClick={(e) => {
              setEditable(true);
            }}
            size={"icon"}
          >
            <Edit />
          </Button>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            checkSubmit(form.getValues());
          }}
          className="space-y-6"
        >
          <CardContent>
            <FormField
              control={form.control}
              name="drugs"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2 md:col-span-1 leading-10">
                    Drugs:{" "}
                  </FormLabel>
                  <div className="col-span-4 md:col-span-5">
                    {field?.value?.length! > 0 &&
                      field?.value?.map((med, medIndex) => (
                        <Badge key={medIndex} variant={"blue"}>
                          {med}
                        </Badge>
                      ))}
                  </div>
                  <FormControl className="col-span-4 md:col-span-5">
                    {editable && (
                      <Input
                        placeholder="Enter drugs details, separated by commas"
                        disabled={!editable}
                        value={field.value?.join(",")}
                        onChange={(e) => {
                          form.setValue("drugs", e.target.value.split(","));
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ... other fields ... */}
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2 md:col-span-1 leading-10">
                    Allergies:{" "}
                  </FormLabel>
                  <div className="col-span-4 md:col-span-5">
                    {field?.value?.length! > 0 &&
                      field?.value?.map((med, medIndex) => (
                        <Badge key={medIndex} variant={"green"}>
                          {med}
                        </Badge>
                      ))}
                  </div>
                  <FormControl className="col-span-4 md:col-span-5">
                    {editable && (
                      <Input
                        placeholder="Enter drugs details, separated by commas"
                        value={field.value?.join(",")}
                        disabled={!editable}
                        onChange={(e) => {
                          form.setValue("allergies", e.target.value.split(","));
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ... other fields ... */}
            <FormField
              control={form.control}
              name="previousDiseases"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2 md:col-span-1 leading-10">
                    Previous Deasises:{" "}
                  </FormLabel>
                  <div className="col-span-4 md:col-span-5">
                    {field?.value?.length! > 0 &&
                      field?.value?.map((med, medIndex) => (
                        <Badge key={medIndex} variant={"red"}>
                          {med}
                        </Badge>
                      ))}
                  </div>
                  <FormControl className="col-span-4 md:col-span-5">
                    {editable && (
                      <Input
                        placeholder="Enter deasises details, separated by commas"
                        value={field.value?.join(",")}
                        disabled={!editable}
                        onChange={(e) => {
                          form.setValue(
                            "previousDiseases",
                            e.target.value.split(",")
                          );
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialDiet"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2 md:col-span-1 leading-10">
                    Special Diet :{" "}
                  </FormLabel>
                  <FormControl className="col-span-4 md:col-span-5">
                    {editable ? (
                      <Input
                        placeholder="Enter diet details, separated by commas"
                        disabled={!editable}
                        value={field.value}
                        onChange={(e) => {
                          form.setValue("specialDiet", e.target.value);
                        }}
                      />
                    ) : (
                      <Label className="leading-10">
                        {" "}
                        {field.value || "None"}{" "}
                      </Label>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bloodGroup"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2 md:col-span-1 leading-10">
                    Blood Group
                  </FormLabel>
                  <FormControl className="col-span-4 md:col-span-5">
                    {editable ? (
                      <Select
                        disabled={!editable}
                        value={field.value}
                        onValueChange={(e) => {
                          form.setValue("bloodGroup", e as "A+");
                        }}
                      >
                        <SelectTrigger value={field.value}>
                          <SelectValue placeholder="select a Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Label className="leading-10"> {field.value} </Label>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otherNotice"
              render={({ field }) => (
                <FormItem className="grid grid-cols-6 items-center">
                  <FormLabel className="col-span-2 md:col-span-1 leading-10">
                    Other notes
                  </FormLabel>
                  <FormControl className="col-span-4 md:col-span-5">
                    {editable ? (
                      <Input
                        placeholder="Enter note "
                        value={field.value}
                        onChange={(e) => {
                          form.setValue("otherNotice", e.target.value);
                        }}
                      />
                    ) : (
                      <Label className="leading-10 text-card-foreground">
                        {" "}
                        {field?.value}{" "}
                      </Label>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              <Button type="submit">Submit</Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </Form>
  );
}
