"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";
import { List, ListItem } from "@/components/ui/list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import {
  addSectionModules,
  getModules,
  getSectionModules,
} from "@/server/cirriculiam";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { clickOn } from "@/lib/helpers";
import {Loader2} from "lucide-react";
import { Children, ModuleData, SectionData, SectionModuleData, UsersAuthSelect } from "@/types";
import { ApiState, useApi, useModuleStore, useSessionUser, useUserTable } from "@/lib/hooks";
import Calendar from "@/components/calendar/Calendar";
import {getEducators} from "@/server/users";

type Props = {
  section: SectionData;
  kids: Children[];
  educators: UsersAuthSelect[];
};

const SectionDetails = ({ section, kids, educators }: Props) => {
  const { currentUser } = useSessionUser();
  const modulesState = useApi(getModules, []);
  const sectionModulesState = useApi(
    async () => await getSectionModules({ section: section.id }),[section]
  );

  const sectionEducators = useApi(async () => {
    return await getEducators({section: section.id})
  },[section])
  const handleSubmitSectionModules = async (data: SectionModuleData[]) => {
    try {
      const res = await addSectionModules(data);
      if (res > 0) {
        toast.success("modules added successfully");
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      const err = error as Error;
      if (err.message.startsWith("duplicat")) {
        toast.error("this module has already existed");
      } else {
        toast.error(err.message);
      }
    }
  };
  return (
    <Card className="max-w-4xl mx-auto rounded-lg shadow-md p-6">
      <header className="flex flex-col items-center">
        <Avatar className="w-32 h-32 rounded-full">
          <AvatarImage className="w-32 h-32 rounded-full" src={section.photo} />
          <AvatarFallback className="w-32 h-32 rounded-full">
            {section.name.at(0)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="mb-8 max-w-lg">
          <h2 className="text-2xl font-bold text-center">{section.name}</h2>
          <p className="leading-none text-muted-foreground font-mono font-normal text-sm">
            {" "}
            {section.description}{" "}
          </p>
        </CardTitle>
        <List className="w-full">
          <ListItem>Seats : {section.seats}</ListItem>
          <ListItem>Category : {section.age} years old</ListItem>
        </List>
      </header>

      <Separator className="my-4" />

      <Tabs defaultValue="Children">
        <TabsList className="grid w-full grid-cols-4 bg-inherit">
          <TabsTrigger value="Children">Children</TabsTrigger>
          <TabsTrigger value="Educators">Educators</TabsTrigger>
          <TabsTrigger value="Schedule">Schedule</TabsTrigger>
          <TabsTrigger value="Modules">Modules</TabsTrigger>
        </TabsList>
        <TabsContent value="Children">
          <h3 className="text-xl font-semibold mb-2">
            Children in this Section
          </h3>
          <List>
            {kids.map((child, index) => (
              <ListItem key={index} className="mb-2">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <Avatar className="w-16 h-16 rounded-full">
                      <AvatarImage
                        className="w-16 h-16 rounded-full"
                        src={child.photo || undefined}
                      />
                      <AvatarFallback className="w-16 h-16 rounded-full">
                        {child.lastName?.at(0)?.toUpperCase() ||
                          "" + child.firstName?.at(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {child.firstName + " " + child.lastName}
                    </p>

                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"></div>
                </div>
              </ListItem>
            ))}
          </List>
        </TabsContent>
        <TabsContent value="Educators">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold mb-2">
              Educators in this Section
            </h3>
            <SectionEducatorsDialog
              educatorsState={educators}
              onSubmit={(e) => {}}
            />
          </div>
          {educators.map((educator, ind) => (
            <div key={ind} className="flex items-center space-x-4 mb-6">
              <Avatar className="w-32 h-32 rounded-full">
                <AvatarImage
                  className="w-32 h-32 rounded-full"
                  src={educator.rawUserMetaData?.photo}
                />
                <AvatarFallback>
                  {educator.rawUserMetaData?.firstName.toUpperCase() +
                    educator.rawUserMetaData?.lastName.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">
                  {educator.rawUserMetaData?.lastName +
                    " " +
                    educator.rawUserMetaData?.firstName}
                </h3>
                <p className="text-gray-500">Educator</p>
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="Schedule">
          <Calendar
              modules = {modulesState?.data || []}
              section = {section}

          />
        </TabsContent>
        <TabsContent value="Modules">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold mb-2">
              Modules in this Section
            </h3>
            <SectionModulesDialog
              section={section}
              modulesState={modulesState}
              onSubmit={handleSubmitSectionModules}
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2 mt-3">
            {sectionModulesState.data?.map((module, idx) => (
              <Card
                key={idx}
                className="grid grid-cols-3 overflow-hidden max-md:max-h-[300px]"
              >
                <img
                  className="w-full aspect-video"
                  src={module.photo}
                  alt=""
                />
                <CardContent className="pt-6 pl-2 flex-1 col-span-2">
                  <CardTitle>{module.name}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default SectionDetails;

export const SectionModulesDialog = ({
  modulesState,
  section,
  onSubmit ,
}: {
  modulesState: ApiState<ModuleData[]>;
  section: SectionData;
  onSubmit: (data: SectionModuleData[]) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { rows, itemsPerPage, addToSelectedRows, selectedRows, deselectRow } =
    useModuleStore((state) => state);

  useEffect(() => {
    const data = modulesState.data;
    console.log(data);
    if (data) {
      console.log({ pageCount: Math.floor(data?.length / itemsPerPage) + 1 });
      useModuleStore.setState({
        data: data,
        rows: data,
        pageCount: Math.floor(data?.length / itemsPerPage) + 1,
      });
    }
  }, [modulesState?.data]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary"> Add Module </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({ selectedRows });

            setIsSubmitting(true);

            onSubmit(
              selectedRows.map((row) => ({
                section: section.id,
                moduleId: row.id,
                data: ""
              }))
            );
            setIsSubmitting(false);

            setTimeout(() => {
              clickOn("close_modules_trigger");
            }, 500);
          }}
        >
          <DialogHeader>
            <DialogTitle>Modules</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <List>
            {rows?.map((module, index) => (
              <ListItem
                key={index}
                className="flex items-center space-x-4 rtl:space-x-reverse"
              >
                <Checkbox
                  checked={selectedRows.includes(module)}
                  onCheckedChange={(e) => {
                    e ? addToSelectedRows(module) : deselectRow(module);
                    // onSelect?.(getSelectedRows());
                  }}
                />

                <div className="flex-shrink-0">
                  <Avatar className="w-16 h-16 rounded-full">
                    <AvatarImage
                      src={module.photo}
                      className="w-16 h-16 rounded-full"
                    />
                    <AvatarFallback className="w-16 h-16 rounded-full text-center leading-10">
                      {module.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {module.name}
                  </p>

                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"></div>
              </ListItem>
            ))}
          </List>

          <DialogFooter>
            <DialogClose id="close_modules_trigger">
              <Button variant={"outline"}> Cancel</Button>{" "}
            </DialogClose>
            <Button type="submit">
              {" "}
              {isSubmitting && <Loader2 className="animate-spin" />} Save
              changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// @ts-ignore
export const SectionEducatorsDialog = ({
  educatorsState,
  onSubmit,
}: {
  educatorsState: UsersAuthSelect[];
  onSubmit: (data: UsersAuthSelect[]) => void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { rows, itemsPerPage, addToSelectedRows, selectedRows, deselectRow } =
    useUserTable((state) => state);

  useEffect(() => {
    const data = educatorsState;
    console.log(data);
    if (data) {
      console.log({ pageCount: Math.floor(data?.length / itemsPerPage) + 1 });
      useUserTable.setState({
        data: data,
        rows: data,
        pageCount: Math.floor(data?.length / itemsPerPage) + 1,
      });
    }
  }, [educatorsState]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary"> Add Educator </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({ selectedRows });

            setIsSubmitting(true);

            onSubmit(selectedRows);
            setIsSubmitting(false);

            setTimeout(() => {
              clickOn("close_educators_trigger");
            }, 500);
          }}
        >
          <DialogHeader>
            <DialogTitle>Educators</DialogTitle>
            <DialogDescription>
              Make changes to Section&apos;s Educator.
            </DialogDescription>
          </DialogHeader>

          <List>
            {rows?.map((educator, index) => (
              <ListItem
                key={index}
                className="flex items-center space-x-4 rtl:space-x-reverse"
              >
                <Checkbox
                  checked={selectedRows.includes(educator) }
                  onCheckedChange={(e) => {
                    e ? addToSelectedRows(educator) : deselectRow(educator);
                    // onSelect?.(getSelectedRows());
                  }}
                />

                <div className="flex-shrink-0">
                  <Avatar className="w-16 h-16 rounded-full">
                    <AvatarImage
                      src={educator.rawUserMetaData?.photo}
                      className="w-16 h-16 rounded-full"
                    />
                    <AvatarFallback className="w-16 h-16 rounded-full text-center leading-10">
                      {educator.rawUserMetaData?.firstName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {educator.rawUserMetaData?.firstName +
                      " " +
                      educator.rawUserMetaData?.lastName}
                  </p>

                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white"></div>
              </ListItem>
            ))}
          </List>

          <DialogFooter>
            <DialogClose id="close_modules_trigger">
              <Button variant={"outline"}> Cancel</Button>{" "}
            </DialogClose>
            <Button type="submit">
              {" "}
              {isSubmitting && <Loader2 className="animate-spin" />} Save
              changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
