"use client"
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
import { createDiscount } from "@/server/payment";
import { toast } from "sonner";
import { DiscountData } from "@/types";


type Props = {
    onSubmit?: (data: DiscountData[]) => void;
    onCancel?: () => void;
    
} 

export function DiscountDialog({}: Props) {
  return (
    <Dialog>
      <DialogTrigger id="discount-trigger" asChild>
        <Button variant="outline">Add discount</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Discount</DialogTitle>
          <DialogDescription>
            Create discounts for your customers.
          </DialogDescription>
        </DialogHeader>
        <DiscountForm
          onSubmit={async (params) => {
            const { error, data } = await createDiscount(params);
            if (data) {
              toast.success("Discount created successfully");
                // onSubmit?.(data);
            } else {
              toast.error(error);
            }
            setTimeout(() => {
              clickOn("discount-trigger");
            }, 1000);
          }}
          onCancel={() => {
            clickOn("discount-trigger");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
