import { useForm } from "react-hook-form";
import {
    Badge, Button, Form, FormControl, FormDescription,
    FormField,
    FormItem,
    FormLabel, FormMessage,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger
} from "@/components/ui";
import { ModuleData, SectionData } from "@/types";
import { ScheduleFormSchema } from "@/db/forms/formsSchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

type FormData = z.infer<typeof ScheduleFormSchema>;

type FormProps = {
    modules?: ModuleData[];
    section?: SectionData;
    schedule: { start: string, end: string };
    onSubmit: (data: FormData) => void;
    onCancel?: () => void;
};

export default function ScheduleForm({ modules, section, schedule, onSubmit, onCancel }: FormProps) {

    const form = useForm<FormData>({
        resolver: zodResolver(ScheduleFormSchema),
        defaultValues: {
            type: "education",

            education: {
                start: schedule.start,
                end: schedule.end,
                sectionId: section?.id,
            },
            nutrition: {
                start: schedule.start,
                end: schedule.end,
                title: "",
                content: [""],
                description: ""
            }
        }
    });

    const { handleSubmit, control } = form;

    const checkSubmit = () => {

        const params : z.infer<typeof ScheduleFormSchema> = {
            type: form.getValues("type"),
            education: form.getValues("education"),
            nutrition: form.getValues("nutrition")
        }

    }

    return (
        <Form {...form}>
            <form
                className="space-y-3"
                onSubmit={(e) => {
                    try {
                        e.preventDefault();
                        onSubmit(form.getValues() as FormData)
                    } catch (e) {
                        console.log(e)
                    }

                }}
            >
                <FormField name="type" render={({ field }) => (
                    <FormItem>
                        <Select onValueChange={(e) => form.setValue("type", e as "nutrition" | "education")} {...field}>
                            <SelectTrigger>
                                {field.value}
                            </SelectTrigger>
                            <SelectContent>
                                {["education", "nutrition"].map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />

                {form.watch("type") === "nutrition" && (
                    <>
                        <FormField name="nutrition.title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <Input type="text" {...field} />
                            </FormItem>
                        )} />
                        <FormField name="nutrition.description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <Input type="text" {...field} />
                            </FormItem>
                        )} />
                        <FormField
                            control={form.control}
                            name="nutrition.start"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Meal Time</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        value={field.value}
                                        onChange={(e) => form.setValue("nutrition.start", e.target.value)}
                                    />
                                    <FormDescription>When the upcoming events are scheduled</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nutrition.end"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Event End</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        value={field.value}
                                        onChange={(e) => form.setValue("nutrition.end", e.target.value)}
                                    />
                                    <FormDescription>When the upcoming events are scheduled</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nutrition.content"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-6 items-center">
                                    <FormLabel className="col-span-2 md:col-span-1 leading-10">
                                        Content
                                    </FormLabel>
                                    <div className="col-span-4 md:col-span-5">
                                        {field.value?.length > 0 &&
                                            field.value.map((item, index) => (
                                                <Badge key={index} variant={"green"}>
                                                    {item}
                                                </Badge>
                                            ))}
                                    </div>
                                    <FormControl className="col-span-4 md:col-span-5">
                                        <Input
                                            placeholder="Enter items, separated by commas"
                                            value={field.value?.join(",")}
                                            onChange={(e) => form.setValue("nutrition.content", e.target.value.split(","))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                {form.watch("type") === "education" && (
                    <>
                        <FormField control={form.control} name="education.moduleId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Module</FormLabel>
                                <Select
                                    onValueChange={(e) => {
                                        console.log({modules, e: e})
                                        form.setValue("education.moduleId", parseInt(e))
                                        form.setValue("education.title", modules?.find(module => module.id === field.value)?.name || "" )
                                        console.log(form.getValues("education"))
                                        console.log(modules?.find(module => module.id === field.value)?.name)
                                    }}
                                        value={`${field.value}`}
                                >
                                    <SelectTrigger value={field.value}>
                                        {modules?.find(module => module.id === field.value)?.name || "Select a module"}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {modules?.map((module) => (
                                            <SelectItem key={module.id} value={`${module.id}`}>
                                                {module.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )} />
                        <FormField name="education.description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <Input type="text" {...field} />
                            </FormItem>
                        )} />
                        <FormField
                            control={form.control}
                            name="education.start"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Event Date</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        value={field.value}
                                        onChange={(e) => form.setValue("education.start", e.target.value)}
                                    />
                                    <FormDescription>When the upcoming events are scheduled</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="education.end"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Event End</FormLabel>
                                    <Input
                                        type="datetime-local"
                                        value={field.value}
                                        onChange={(e) => form.setValue("education.end", e.target.value)}
                                    />
                                    <FormDescription>When the upcoming events are scheduled</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onCancel?.()}>Cancel</Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    );
}
