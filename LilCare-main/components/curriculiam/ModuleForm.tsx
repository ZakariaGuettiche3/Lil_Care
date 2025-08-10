import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { ModuleFormSchema } from "@/db/forms/formsSchema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {Loader2, Plus} from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { postImage } from "@/lib/apis";
import { format } from "date-fns";

const formSchema = ModuleFormSchema;
type formSchemaType = typeof formSchema._type;

type Props = {
  onSubmit?: (data: formSchemaType) => void;
  defaultValue?: Required<formSchemaType>;
  onClose?: () => void;
};

function ModuleForm({ defaultValue, onSubmit, onClose }: Props) {
  const form = useForm<formSchemaType>({ resolver: zodResolver(formSchema) });
  const [image, setImage] = useState<File>();
  const [isSubmitting , setIsSubmitting] = useState(false)
  const checkSubmit = async (data: formSchemaType) => {
    if (image) {
      let imageRes = await postImage({ file: image });
      data.photo = imageRes.url;
      console.log({data});
      
      onSubmit?.(data);
      return;
    }
    onSubmit?.(data);
  };

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
    <Dialog>
      <DialogTrigger>
        <Button size={"sm"}>
          {" "}
          <Plus /> Module{" "}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-semibold text-lg">
            {" "}
            Create Module{" "}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(checkSubmit)}>
            {image ? (
              <img src={form.watch().photo} className="w-full aspect-video" />
            ) : (
              <div className="border rounded-md flex justify-center items-center border-blue-500 border-dashed bg-secondary w-full aspect-video">
                <Label
                  className=" text-center  cursor-pointer"
                  htmlFor="module_photo"
                >
                  {" "}
                  Browse or Drage photo{" "}
                </Label>
                <Input
                  id="module_photo"
                  className="hidden"
                  type="file"
                  onChange={handleImage}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label> Name:</Label>
                  <FormControl>
                    <Input
                      value={form.watch("name")}
                      onChange={field.onChange}
                      type="text"
                    />
                  </FormControl>{" "}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label> Description:</Label>
                  <FormControl>
                    <Textarea
                      onChange={field.onChange}
                      value={form.watch("description")}
                    />
                  </FormControl>{" "}
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex flex-row justify-end gap-3">
          <DialogClose>
            <Button
              onClick={(e) => {
                onClose?.();
              }}
              variant={"outline"}
              type="button"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={(e) => {
              form.setValue("createdAt", format((new Date()), "yyyy-MM-dd"))
              console.log(form.getValues())
              checkSubmit(form.getValues())
            }}
            variant={"primary"}
            type="submit"
          >
            {isSubmitting && <Loader2 className = "animate-spin" />}
            {" " }
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ModuleForm;
