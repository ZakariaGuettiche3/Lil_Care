"use client"

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
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { MedicalRecordSchema, PsychologicalProfileSchema } from "@/db/forms/formsSchema";

import { SelectValue } from "@radix-ui/react-select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardFooter } from "@/components/ui/card";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Children, MedicalRecordData, MedicalRecordInsert, PsychologicalProfileData, PsychologicalProfileInsert } from "@/types";
import { Textarea } from "@/components/ui";

type Props = {
    child?: Children;
    editable?: boolean;
    FormType?: "update" | "create" | "read";
    onSubmit?: (data: PsychologicalProfileInsert) => Promise<PsychologicalProfileData | undefined>;
  };
  
  export function PsychologicalProfileForm({ child, onSubmit, FormType, editable: edit }: Props) {
    const [editable, setEditable] = useState(FormType == "create");
    const form = useForm<z.infer<typeof PsychologicalProfileSchema>>({
      resolver: zodResolver(PsychologicalProfileSchema),
      defaultValues: (child?.psychologicalProfile as z.infer<
        typeof PsychologicalProfileSchema
      >) || {
        behavioralObservations: "",
        mentalState: "",
        emotionalState: "",
        personalityCharacteristics: "",
        childId: child?.id,
      },
    });
  
    function checkSubmit(data: z.infer<typeof PsychologicalProfileSchema>) {
      console.log({ data });
  
      if (child) {
        data.childId = child.id;
  
        const res = onSubmit?.(data as PsychologicalProfileInsert);
        console.log({ data: child?.psychologicalProfile });
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
            <CardTitle className=""> Psychological Profile </CardTitle>
            {FormType == "update" && <Button
              variant={"outline"}
              onClick={(e) => {
                setEditable(true);
              }}
              size={"icon"}
            >
              <Edit />
            </Button>}
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
                name="behavioralObservations"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-6 items-center">
                    <FormLabel className="col-span-2 md:col-span-2 leading-10">
                      Behavioral Observations:{" "}
                    </FormLabel>
                    <FormControl className="col-span-4 md:col-span-4">
                      {editable ? (
                        <Textarea
                          placeholder="Enter behavioral observations"
                          disabled={!editable}
                          value={field.value || ""}
                          onChange={(e) => {
                            form.setValue("behavioralObservations", e.target.value);
                          }}
                        />
                      ) : (
                        <Label className="leading-10"> {field.value || "None"} </Label>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Repeat the same pattern for other fields */}
              {/* ... */}
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
  