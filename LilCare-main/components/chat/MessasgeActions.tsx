"use client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";

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
import { useRef } from "react";
import { useMessagesTable } from "@/lib/hooks";
import { ChatMessage, MessageData } from "@/types";
import { deleteMessage, updateMessage } from "@/server/chat";

export function DeleteAlert() {
	const actionMessage = useMessagesTable((state) => state?.ActionRow)!;
	const optimisticDeleteMessage = useMessagesTable(
		(state) => state?.deleteRow
	);
	const handleDeleteMessage = async () => {
		

		const { error } = await deleteMessage(actionMessage?.id)

		if (error) {
			toast.error(error.message);
		} else {
			optimisticDeleteMessage?.(actionMessage!);
			toast.success("Successfully delete a message");
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<button id="trigger-delete"></button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteMessage}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function EditAlert() {
	const actionMessage = useMessagesTable((state) => state.ActionRow);
	const optimisticUpdateMessage = useMessagesTable(
		(state) => state.updateRow
	);

	const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const handleEdit = async () => {
		const text = inputRef.current.value.trim();
		if (text && actionMessage) {
			optimisticUpdateMessage?.(actionMessage!, (prev, updateMessage) => (prev.filter((message) => {
				if (message.id === updateMessage.id) {
				  (message.text = updateMessage.text),
					(message.isEdited = updateMessage.isEdited);
				}
				return message;
			  })));
			const { error } = await updateMessage({...actionMessage, text: text})
			if (error) {
				toast.error(error);
			} else {
				toast.success("Update Successfully");
			}
			document.getElementById("trigger-edit")?.click();
		} else {
			document.getElementById("trigger-edit")?.click();
			document.getElementById("trigger-delete")?.click();
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button id="trigger-edit"></button>
			</DialogTrigger>
			<DialogContent className="w-full">
				<DialogHeader>
					<DialogTitle>Edit Message</DialogTitle>
				</DialogHeader>
				<Input defaultValue={actionMessage?.text} ref={inputRef} />
				<DialogFooter>
					<Button type="submit" onClick={handleEdit}>
						Save changes
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}



