"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Loader2,
  LucideMessageCircleX,
  Paperclip,
  SendIcon,
} from "lucide-react";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { postImage } from "@/lib/apis";
import { useSessionUser } from "@/lib/hooks";
import { ChatData, MessageInsert, UsersAuthSelect } from "@/types";
import { insertMessage } from "@/server/chat";
import { MessageInsertSchema } from "@/db/forms/formsSchema";

type Props = {
  sender: UsersAuthSelect;
  chat: ChatData;
};

const formSchema = MessageInsertSchema;

export default function MessageForm({ sender, chat }: Props) {
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imagesData, setImageData] = useState<string[]>([]);
  const { currentUser: user } = useSessionUser((state) => state);
  const params = useSearchParams().get("chatId") || undefined;

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    supabaseBrowser()
        .auth.getUser()
        .then((user) => {
          useSessionUser.setState({ currentUser: user?.data?.user || undefined });
        });
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.item(0);
    if (selectedFile) {
      const reader = new FileReader();
      setImages((prevImages) => [...prevImages, selectedFile]);
      reader.readAsDataURL(selectedFile);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const imageData = ev.target?.result as string;
        setImageData((prevImagesData) => [...prevImagesData, imageData]);
      };
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text?.trim() || !user?.id) {
      toast.error("Message cannot be empty or user not found!!");
      return;
    }

    setIsSubmitting(true);

    try {
      const files = await Promise.all(
          images.map((image) => postImage({ file: image }))
      );

      const newMessage: MessageInsert = {
        text,
        chat: parseInt(params!),
        sender: user.id,
        createdAt: new Date(),
        files: files,
        metadata: { sender: user },
        isEdited: false,
      };

      const { data, error } = await insertMessage(newMessage);
      if (error) {
        toast.error(error.message);
        return;
      }

      form.reset();
      setImageData([]);
      setImages([]);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="p-5">
        <div className="flex gap-1">
          {imagesData?.map((image, id) => (
              <div key={id} className="relative">
                <div className="absolute w-full h-full hover:flex">
                  <button
                      onClick={() => {
                        setImageData((prevImagesData) =>
                            prevImagesData.filter((i) => i !== image)
                        );
                      }}
                      className=" w-full h-full cursor-pointer flex bg-muted/50 justify-center items-center"
                  >
                    <LucideMessageCircleX className="w-4 aspect-square" />
                  </button>
                </div>
                <img className="w-18 h-16 object-cover" src={image} alt={`Selected ${id}`} />
              </div>
          ))}
        </div>
        <Form {...form}>
          <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(form.getValues("text"));
              }}
          >
            <FormField
                name="file"
                control={form.control}
                render={({ field }) => (
                    <>
                      <Label
                          className={buttonVariants({ variant: "outline", size: "sm" })}
                          htmlFor="upload_file"
                      >
                        <Paperclip />
                      </Label>
                      <Input
                          placeholder="send message"
                          onChange={handleImage}
                          value = {field.value}
                          type="file"
                          id="upload_file"
                          className="hidden"
                      />
                    </>
                )}
            />
            <FormField
                name="text"
                control={form.control}
                render={({ field }) => (
                    <Input
                        placeholder="send message"
                        onChange={field.onChange}
                        value = {field.value}
                    />
                )}
            />
            <Button size={"sm"} type="submit" variant={"primary"}>
              {!isSubmitting ? <SendIcon /> : <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </div>
  );
}
