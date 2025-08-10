import React, { useState } from "react";
import { usePDF } from "react-to-pdf";
import { useQRCode } from "next-qrcode";
import { Children } from "@/types";
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
import { Loader, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { clickOn } from "@/lib/helpers";

type Props = {
  child?: Children;
};

function ChildBadge({ child }: Props) {
  const { toPDF, targetRef } = usePDF({
    filename: `${child?.lastName}_${child?.firstName}.pdf`,
  });
  const { Canvas } = useQRCode();

  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button id={"export-trigger"} disabled={!child} variant={"outline"}>
            Export Badge
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          {child && (
            <div ref={targetRef}>
              <div className="flex  h-full justify-center items-center">
                <Canvas
                  text={JSON.stringify(child)}
                  options={{
                    errorCorrectionLevel: "M",
                    margin: 3,
                    scale: 4,
                    width: 200,
                    color: {
                      dark: "#010599FF",
                      light: "#fff",
                    },
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setIsDownloading(true);
                toPDF();
                setTimeout(() => {
                  setIsDownloading(false);
                }, 500);
                toast.success("Badge Downloaded Successfully!");
                setTimeout(() => clickOn("export-trigger"), 1000);
              }}
              type="submit"
            >
              {isDownloading && <Loader2 className="animate-spin" />} Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className=""></div>
    </div>
  );
}

export default ChildBadge;
