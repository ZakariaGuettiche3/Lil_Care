"use client";
import React, { useState } from "react";
import { InvoiceFormSchema } from "../../../db/forms/formsSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { services, customers } from "../../../db/modules/payment";
import {
  CustomerData,
  DiscountData, ParentData,
  PriceData,
  Service,
  ServiceData,
  UserAuthData,
} from "@/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { set } from "date-fns";
import ParentTable from "@/components/tables/ParentsTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Loader2, Send } from "lucide-react";
import { on } from "events";
import { useApi } from "@/lib/hooks";
import { getParents } from "@/server/users";
import { toast } from "sonner";
import { createInvoices } from "@/server/payment";
import { UsersAuthSelect } from '@/types/data';

type FormSubmit = (typeof InvoiceFormSchema._type)[];

type Props = {
  services?: ServiceData[];
  discounts?: DiscountData[];
  customers?: UsersAuthSelect[];
  onSubmit?: (data: FormSubmit) => void;
};

const onSubmit = async (data: FormSubmit) => {
  const { data: response, error } = await createInvoices(data);
  if (response) {
    toast.success("Invoice created successfully");
  } else {
    toast.error(error);
  }
};

function InvoiceForm({ services, discounts, customers }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipents, setReceipents] = useState<UsersAuthSelect<ParentData>[]>([]);
  const form = useForm<FormSubmit[0]>({
    resolver: zodResolver(InvoiceFormSchema),
  });

  const checkSubmit = async (data: FormSubmit[0]) => {
    setIsSubmitting(true);
    const invoices = receipents.map((receipent) => {
      return {
        ...data,
        customer: {
          email: receipent.email!,
          id: receipent.rawUserMetaData?.customerId!,
          phone: receipent.rawUserMetaData.phone!,
          name: receipent.rawUserMetaData.lastName + " " + receipent.rawUserMetaData.firstName,
        },
      };
    });

    // const res = await onSubmit?.(invoices);
    console.log(invoices);
    const {data: response, error} = await createInvoices(invoices);
    toast.success("invoices has been send successfully")
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkSubmit(form.getValues());
        }}
      >
        <div className="flex flex-col gap-3">
          <Card className="border-0" x-chunk="dashboard-06-chunk-0">
            <CardHeader className="flex-row justify-between items-center py-4">
              <CardTitle>Create Invoice</CardTitle>
              <Button type="submit" variant={"outline"}>
                {isSubmitting && <Loader2 className="animate-spin"/>} {"Send"}
              </Button>
            </CardHeader>
          </Card>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader className="flex-row justify-between">
              <CardTitle>Facture</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.id}
                        onValueChange={(value) =>
                          form.setValue(
                            "service",
                            services?.find((service) => service.id === value)!
                          )
                        }
                      >
                        <SelectTrigger>
                          {field.value?.name || "Select service"}
                        </SelectTrigger>
                        <SelectContent>
                          {services?.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.id.toString()}
                        onValueChange={(value) =>
                          form.setValue(
                            "discount",
                            discounts?.find(
                              (discount) => discount.id === parseInt(value)
                            )!
                          )
                        }
                      >
                        <SelectTrigger>
                          {field.value?.name || "Select discount"}
                        </SelectTrigger>
                        <SelectContent>
                          {discounts?.map((discount) => (
                            <SelectItem
                              key={discount.id}
                              value={discount.id.toString()}
                            >
                              {discount.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.id}
                        onValueChange={(value) =>
                          form.setValue(
                            "price",
                            form
                              .getValues("service")
                              ?.metadata.prices.find(
                                (price) => price.id === value
                              )!
                          )
                        }
                      >
                        <SelectTrigger>
                          {field.value?.price
                            ? `${field.value.price} dz / ${field.value.type}`
                            : "Select price"}
                        </SelectTrigger>
                        <SelectContent>
                          {form
                            .watch("service")
                            ?.metadata?.prices?.map((price) => (
                              <SelectItem key={price.id} value={price.id}>
                                {price.price} dz / {price.type}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <ParentTable
            title="Customers"
            apiState={customers}
            onSelect={(users) => {
              setReceipents(users);
            }}
          />
        </div>
      </form>
    </Form>
  );
}

export default InvoiceForm;
