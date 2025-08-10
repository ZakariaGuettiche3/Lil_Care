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
import { SectionsInsertSchema } from "@/db/forms/formsSchema";
import { useState } from "react";
import { CustomImage, Textarea } from "../ui";
import { Inbox, Loader2 } from "lucide-react";
import { clickOn } from "@/lib/helpers";
import { postImage } from "@/lib/apis";

const formSchema = SectionsInsertSchema;

type FormData = z.infer<typeof formSchema>;

type FormProps = {
  default?: Partial<FormData>;
  onSubmit?: (data: z.infer<typeof formSchema>) => Promise<any>;
  onClose?: () => void;
};

export default function SectionsForm({ onSubmit }: FormProps) {
    const [submitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false);
  const [prices, setPrices] = useState<{type: string, amount: number}[]>([])
  const [image, setImage] = useState<File>();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const checkSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsSubmitting(true)
    // Handle form Last Check before submission  logic here
    // e.g., send POST request to your API endpoint to add the parent to the database
    if (image) {
        setIsUploading(true)
    const { name , description , photo, service : {prices}} = data
    let imageRes = await postImage({ file: image });
    const params: FormData = { name, description, photo: imageRes.url, service : {
            name: name,
            description: description,
            dtype: "section",
            prices: prices,
            Images: [],
        } };
          setIsUploading(false)

        params.service.Images = [imageRes.url];
      console.log({params})
      onSubmit?.(params);
        setIsSubmitting(false)
      return;
    }
      setIsSubmitting(false)

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
        form.setValue("photo", imageData); // Store the Base64-encoded image data
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
        className="w-full space-y-6 max-w-xl mx-auto"
      >
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem className="grid-cols-1">
              <FormLabel htmlFor="photo" className="cursor-pointer">
                <CustomImage
                  src={field.value as string}
                  className=" object-cover w-full h-64 rounded-md"
                  Alt={
                      isUploading ? (
                        <div className="border aspect-video rounded-md border-white flex hover:bg-opacity-70 items-center justify-center overflow-hidden  shadow w-full">

                        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
                        <p className="mt-2 text-sm text-slate-400">
                          Uploading...
                        </p>
                      </div>
                      ) : (
                        <div className="border aspect-video rounded-md border-white flex hover:bg-opacity-70 items-center justify-center overflow-hidden  shadow w-full">

                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className="mt-2 text-sm text-slate-400 text-center">
                          Drag file here, or click to select files
                        </p>
                      </div>
                      )
                  }
                />
              </FormLabel>

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
        <div className="grid-cols-2 gap-3 w-full">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem className="grid-cols-2">
                <FormLabel>Category:</FormLabel>
                <Input
                  type="number"
                  value={field.value}
                  onChange={(e) => {
                    form.setValue("age", parseInt(e.target.value));
                  }}
                />
                <FormDescription>
                  Age of children in this section{" "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seats"
            render={({ field }) => (
              <FormItem className="grid-cols-2">
                <FormLabel>Seats:</FormLabel>
                <Input
                  value={field.value}
                  type="number"
                  onChange={(e) => {
                    form.setValue("seats", parseInt(e.target.value));
                  }}
                />
                <FormDescription>
                  Maximun number of children in this section{" "}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="service.prices.0.type"
            render={({ field }) => (
              <FormItem className="grid-cols-1">
                <FormLabel>Prices :</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
            name="service.prices.0.price"
            render={({ field }) => (
              <FormItem className="grid-cols-2">
                <FormLabel>Amount :</FormLabel>
                <Input
                  value={field.value}
                  type="number"
                  onChange={(e) => {
                    form.setValue("service.prices.0.price", parseInt(e.target.value));
                  }}
                />
                <FormDescription>
                  Price of this section{" "}
                </FormDescription>
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
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={() => {
              clickOn("section-trigger-insert");
            }}
            variant={"outline"}
            type="button"
          >
            Cancel
          </Button>
          <Button variant={"primary"} type="submit">
              {submitting && <Loader2 className="animate-spin"/>} Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
