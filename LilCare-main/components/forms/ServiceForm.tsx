import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  SectionsInsertSchema,
  ServiceInsertSchema,
} from "@/db/forms/formsSchema";
import { toast } from "sonner";
import { useState } from "react";
import { CustomImage, Textarea } from "../ui";
import { Images, Inbox, Loader2 } from "lucide-react";
import { clickOn } from "@/lib/helpers";
import { postImage } from "@/lib/apis";

const formSchema = ServiceInsertSchema;

type FormData = Omit<z.infer<typeof formSchema>, "metadata" | "id">;

type FormProps = {
  default?: Partial<FormData>;
  onSubmit?: (data: FormData) => Promise<any>;
  onCancel?: () => void;
};

export default function ServiceForm({ onSubmit, onCancel }: FormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<File>();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const checkSubmit = async (data: FormData) => {
    // Handle form Last Check before submission  logic here
    // e.g., send POST request to your API endpoint to add the parent to the database
    if (image) {
      setIsUploading(true);
      const { name, description, dtype, Images, prices } = data;
      let imageRes = await postImage({ file: image });
      const params = {
        name,
        description,
        dtype,
        Images: [imageRes.url],
        prices: prices,
      };
      console.log({ params });
      onSubmit?.(params as FormData);
      setIsUploading(false);
      return;
    }
  };
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Handle image called");
    const selectedFile = e.target?.files?.item(0);
    if (selectedFile) {
      const reader = new FileReader();
      setImage(selectedFile);
      reader.readAsDataURL(selectedFile);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const imageData = ev.target?.result as string;
        console.log("imageData: ", imageData);
        form.setValue("Images", [imageData]); // Store the Base64-encoded image data
      };
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkSubmit(form.getValues());
        }}
        className="w-full space-y-6"
      >
        <FormField
          control={form.control}
          name="Images.0"
          render={({ field }) => (
            <FormItem className="grid-cols-1">
              <FormLabel htmlFor="photo" className="cursor-pointer">
                <CustomImage
                  src={field.value as string}
                  className="aspect-video object-cover w-full h-full rounded-md"
                  Alt={
                    isUploading ? (
                      <div className="border rounded-md border-white flex hover:bg-opacity-70 items-center justify-center overflow-hidden  shadow w-full">
                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                          Uploading...
                        </p>
                      </div>
                    ) : (
                      <div className="border rounded-md border-white flex hover:bg-opacity-70 items-center justify-center overflow-hidden  shadow w-full">
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400 text-center">
                          Drag file here, or click to select files
                        </p>
                      </div>
                    )
                  }
                />
              </FormLabel>
              {/* <FormLabel htmlFor="photo">
                  <div className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 px-2 flex flex-col justify-center items-center"></div>
                </FormLabel> */}
              <FormControl>
                <Input
                  className="hidden"
                  id="photo"
                  type="file"
                  onChange={handleImage}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Name:</FormLabel>
              <FormControl>
                <Input onChange={field.onChange} defaultValue={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dtype"
          render={({ field }) => (
            <FormItem className="grid-cols-1">
              <FormLabel>Service :</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="section">Section</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prices.0.type"
          render={({ field }) => (
            <FormItem className="grid-cols-1">
              <FormLabel>Prices :</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Subscription type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Once">Once</SelectItem>
                  <SelectItem value="Month">Monthly</SelectItem>
                  <SelectItem value="Year">Yearly</SelectItem>
                  <SelectItem value="Quarter">quarter</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prices.0.price"
          render={({ field }) => (
            <FormItem className="grid-cols-2">
              <FormLabel>Amount :</FormLabel>
              <Input
                value={field.value}
                type="number"
                onChange={(e) => {
                  form.setValue("prices.0.price", parseInt(e.target.value));
                }}
              />
              <FormDescription>Price of this section </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description:</FormLabel>
              <FormControl>
                <Textarea
                  onChange={field.onChange}
                  defaultValue={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <Button
            onClick={(e) => {
              clickOn("service-trigger-insert");
            }}
            variant={"outline"}
            type="button"
          >
            Cancel
          </Button>
          <Button variant={"primary"} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
