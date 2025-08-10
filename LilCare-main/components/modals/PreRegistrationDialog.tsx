import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clickOn } from "@/lib/helpers";
import { toast } from "sonner";
import { EventData } from "@/types";
import PreRegistrationAccept from "../forms/PreRegistrationAccept";
import { acceptPreregistration } from "@/server/preregistrations";

type Props = {
  onSubmit?: (data: EventData) => void;
  onCancel?: () => void;
};

export function PreRegistrationDialog({ onSubmit, onCancel }: Props) {
  return (
    <Dialog>
      <DialogTrigger id="preregister-trigger">
        {/* <Button>Accept PreRegistration</Button> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Accept PreRegistration</DialogTitle>
          <DialogDescription>Accept PreRegistration </DialogDescription>
        </DialogHeader>
        <PreRegistrationAccept
          onSubmit={async (params) => {
            const { error, data } = await acceptPreregistration(params);
            if (data) {
              toast.success("PreRegistration  completed successfully");
            } else {
              toast.error(error);
            }
            setTimeout(() => {
              clickOn("preregister-trigger");
            }, 1000);
          }}
          onCancel={() => {
            clickOn("preregister-trigger");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
