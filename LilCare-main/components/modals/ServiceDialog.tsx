"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DiscountForm from "../forms/payment/DiscountFrom";
import { clickOn } from "@/lib/helpers";
import { createDiscount, createService } from "@/server/payment";
import { toast } from "sonner";
import { DiscountData } from "@/types";
import ServiceForm from "../forms/ServiceForm";

type Props = {
  onSubmit?: (data: DiscountData[]) => void;
  onCancel?: () => void;
};

export default function ServiceDialog({}: Props) {
  return (
    <Dialog>
      <DialogTrigger id="service-trigger" asChild>
          <Button variant="outline">Add Service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Service</DialogTitle>
          <DialogDescription>
            Create services for your customers.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
          onSubmit={async (params) => {
            const { error, data  } = await createService(params);
            if (data?.service) {
              toast.success("Service created successfully");
              // onSubmit?.(data);
            } else {
              toast.error(error);
            }
            setTimeout(() => {
              clickOn("service-trigger");
            }, 1000);
          }}
          onCancel={() => {
            clickOn("service-trigger");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
