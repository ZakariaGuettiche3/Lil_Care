"use client"
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui";
const DiscountFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  type: z.enum(["percentage", "amount"], { message: "Type is required" }),
  value: z.number().min(0, { message: "Value must be a positive number" }),
});

type DiscountFormValues = z.infer<typeof DiscountFormSchema>;

interface DiscountFormProps {
  onSubmit: (data: DiscountFormValues) => void;
  onCancel?: () => void;
}

const DiscountForm: React.FC<DiscountFormProps> = ({ onSubmit, onCancel }) => {
  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(DiscountFormSchema),
  });

  const handleSubmit: SubmitHandler<DiscountFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input
                  {...field}
                  type="text"
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    form.setValue("type", value as "percentage" | "amount")
                  }
                >
                  <SelectTrigger>{field.value || "Select type"}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <input
                  value={field.value}
                  onChange={(e) => {
                    form.setValue("value", parseInt(e.target.value));
                  }}
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            onClick={() => {
              onCancel?.();
              form.reset();
            }}
            variant="secondary"
          >
            Cancel
          </Button>
         
          <Button type="submit" className="">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DiscountForm;
