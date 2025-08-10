"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FormItem } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Camera, Check } from "lucide-react";
import { postImage } from "@/lib/apis";
import { ApiState } from "@/lib/hooks";
import { Button } from "../ui/button";
import { educators } from "../../db/schema";
import { set } from "date-fns";
import { UserAuthData } from "@/types";
import { ChatIsertSchema } from "@/db/forms/formsSchema";

type Props = {
  onSubmit?: (data: FormData) => void;
  apiState?: UserAuthData[];
  onClose?:() => void;
};

const formSchema = z.object({
  chat: ChatIsertSchema,
  members: z.array(z.string()),
});
type FormData = z.infer<typeof formSchema>;

const ChatForm = (props: Props) => {
  const [image, setImage] = useState<File>();
  const [allUsers, setAllUsers] = useState<{
    parents: UserAuthData[];
    educators: UserAuthData[];
  }>({ parents: [], educators: [] });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const checkSubmit = async (data: FormData) => {
    
      if (image) {
        let imageRes = await postImage({ file: image });
        data.chat.groupPhoto = imageRes.url;
      }
      const chat = {chat :{...data.chat, isGroup: true}, members : selectedUsers}
      console.log(chat);
      
      props?.onSubmit?.(chat);
    
  };

  const habdleAddUser = (data: UserAuthData) => {

    !selectedUsers.includes(data.id)
      ? setSelectedUsers([...selectedUsers, data.id])
      : setSelectedUsers(selectedUsers.filter((userId) => userId !== data.id));
  };

  useEffect(() => {
    const parents = props?.apiState?.filter((data) => data?.rawUserMetaData?.role === "PARENT");
    const educators = props?.apiState?.filter(
      (data) => data?.rawUserMetaData?.role === "EDUCATOR"
    );
    setAllUsers({
      parents: parents || [],
      educators: educators || [],
    });
    console.log(props?.apiState);

    console.log({ parents} );
  }, [props?.apiState]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target?.files?.item(0);
    if (selectedFile) {
      const reader = new FileReader();
      setImage(selectedFile);
      reader.readAsDataURL(selectedFile);
      reader.onload = (ev: ProgressEvent<FileReader>) => {
        const imageData = ev.target?.result as string;
        form.setValue("chat.groupPhoto", imageData); // Store the Base64-encoded image data
      };
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={(e) => {e.preventDefault()}}>
        <FormField
          name="chat"
          render={({ field }) => (
            <FormItem className="flex gap-2">
              <FormLabel htmlFor="photo" className="cursor-pointer">
                <div className="rounded-full w-32 h-32 flex items-center justify-center border-2 border-white shadow hover:bg-opacity-70 overflow-hidden">
                  <Avatar className="rounded-full w-32 h-32 object-cover border-2 border-white shadow">
                    <AvatarImage
                      src={form.watch("chat.groupPhoto") || undefined}
                    />
                    <AvatarFallback>
                      {" "}
                      <Camera />
                    </AvatarFallback>
                  </Avatar>
                </div>

              </FormLabel>
              <FormControl>
                <Input
                  className="hidden"
                  id="photo"
                  type="file"
                  onChange={handleImage}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormMessage />
        <FormField
          render={({ field }) => (
            <FormItem>
              <FormLabel> Name of Chat</FormLabel>
              <FormControl>
                <Input onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
          name={"chat.name"}
        />

        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Parents">
              {allUsers.parents?.map((parent, idx) => (
                <CommandItem key={idx}>
                <Avatar className="mr-2 h-4 w-4">
                  <AvatarImage src={parent?.rawUserMetaData?.photo} />
                  <AvatarFallback>{parent?.rawUserMetaData?.username}</AvatarFallback>
                </Avatar>
                <span> {parent?.rawUserMetaData?.username} </span>
                <CommandShortcut>
                  {" "}
                  <Button
                    onClick={(e) => {
                      habdleAddUser(parent);
                    }}
                    size={"sm"}
                    variant={"primary"}
                  >
                    {selectedUsers.includes(parent.id) ?<><Check/>  Added</> : "Add"}
                  </Button>{" "}
                </CommandShortcut>
              </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Educators">
              {allUsers.educators?.map((educator, idx) => (
                <CommandItem key={idx}>
                <Avatar className="mr-2 h-4 w-4">
                  <AvatarImage src={educator?.rawUserMetaData?.photo} />
                  <AvatarFallback>{educator?.rawUserMetaData?.username}</AvatarFallback>
                </Avatar>
                <span> {educator?.rawUserMetaData?.username} </span>
                <CommandShortcut>
                  {" "}
                  <Button
                    onClick={(e) => {
                      habdleAddUser(educator);
                    }}
                    size={"sm"}
                    variant={"primary"}
                  >
                    {selectedUsers.includes(educator.id) ?<><Check/>  Added</> : "Add"}
                  </Button>{" "}
                </CommandShortcut>
              </CommandItem>
              ))}
            </CommandGroup>
            
          </CommandList>
        </Command>
        <div className="flex justify-end gap-3">
          <Button
            onClick={(e) => {
              props?.onClose?.();
            }}
            variant={"outline"}
            type="button"
          >
            Cancel
          </Button>
          <Button variant={"primary"} onClick={(e) => {e.preventDefault(); checkSubmit(form.getValues())}} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ChatForm;
