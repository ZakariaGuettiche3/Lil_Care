"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
    Draggable,
    DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import {
    DialogHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useApi } from "@/lib/hooks";
import { toast } from "sonner";
import { format } from "date-fns";
import ScheduleForm from "@/components/forms/calendar/ScheduleForm";
import {ModuleData, ScheduleData, SectionData} from "@/types";
import {createEducationalSchedule} from "@/server/cirriculiam";
import {getSchedules, getSectionSchedules} from "@/server/schedul";

type Props = {
    modules: ModuleData[]
    section: SectionData
};

interface Event {
    title: string;
    start: string;
    end?:  string;
    // allDay: boolean;
    id: number;
    description?: string;
}

export default function Calendar({ section, modules}: Props) {
    const [allEvents, setAllEvents] = useState<Event[]>([
        {
            title: "event 1",
            description: "everythying is good",
            start: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            id: 1,
        },
    ]);

    const [selectedEvent, setSelectedEvent] = useState<Event>();
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const [newEvent, setNewEvent] = useState<Event>({
        title: "",
        start: "",
        // allDay: false,
        id: 0,
    });


    useEffect(() => {
        let draggableEl = document.getElementById("draggable-el");
        if (draggableEl) {
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    let title = eventEl.getAttribute("title");
                    let id = eventEl.getAttribute("data");
                    let start = eventEl.getAttribute("start");
                    return { title, id, start };
                },
            });
        }
    }, []);


    const schedules = useApi(async () => getSectionSchedules({sectionId: section.id}),[], {onSuccess : async (d) => {
        const data = d as ScheduleData[]
        setAllEvents([...allEvents, ...d])
    }})

    function handleDateClick(arg: { date: Date; allDay: boolean }) {
        setNewEvent({
            ...newEvent,
            start: format(arg.date, "yyyy-MM-dd'T'HH:mm"),
            id: new Date().getTime(),
        });
        setSelectedEvent({
            id: 0,
            start: format(arg.date, "yyyy-MM-dd'T'HH:mm"),
            end: format(arg.date, "yyyy-MM-dd'T'HH:mm"),
            description: "",
            title: "",
        });
        setShowModal(true);
    }

    function addEvent(data: DropArg) {
        const event = {
            ...newEvent,
            start: data.date.toISOString(),
            title: data.draggedEl.innerText,
            allDay: data.allDay,
            id: new Date().getTime(),
        };
        setAllEvents([...allEvents, event]);
    }

    function handleDeleteModal(data: { event: { id: string } }) {
        setShowDeleteModal(true);
        setIdToDelete(Number(data.event.id));
    }

    function handleDelete() {
        setAllEvents(
            allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
        );
        setShowDeleteModal(false);
        setIdToDelete(null);
    }

    function handleCloseModal() {
        setShowModal(false);
        setNewEvent({
            title: "",
            start: "",
            // allDay: false,
            id: 0,
        });
        setShowDeleteModal(false);
        setIdToDelete(null);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setNewEvent({
            ...newEvent,
            title: e.target.value,
        });
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setAllEvents([...allEvents, newEvent]);
        setShowModal(false);
        setNewEvent({
            title: "",
            start: "",
            // allDay: false,
            id: 0,
        });
    }
    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                events={ allEvents?.map((e) => ({id: `${e.id}`, title: e.title, start: e.start, end: e.end}))}
                eventClassNames={"w-full"}
                nowIndicator={true}
                editable={true}
                droppable={true}
                selectable={true}
                selectMirror={true}
                dateClick={handleDateClick}
                drop={(data) => addEvent(data)}
                eventChange={(e) => {}}
                eventClick={(data) => {
                    const start = data.event?.start  || new Date()
                    const end = data.event?.end || start
                    setSelectedEvent({
                        title: data.event.title,
                        description: "",
                        start: format(start, "yyyy-MM-dd'T'HH:mm"),
                        end: format(end, "yyyy-MM-dd'T'HH:mm"),
                        id: parseInt(data.event.id),
                    });
                    console.log(selectedEvent);
                    setShowModal(true);
                }}
            />
            <Dialog
                open={showModal}
                onOpenChange={(showModal) => {
                    setShowModal((showModal) => !showModal);
                }}
            >
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEvent?.end && (
                        <ScheduleForm
                            schedule={{start : selectedEvent.start, end: selectedEvent.end}}
                            onSubmit={async (data) => {


                                toast.success("Schedule created successfully");
                                setShowModal((prev) => !prev);
                            }}
                            modules={modules}
                            section = {section}
                            onCancel={() => {
                                setShowModal(false);
                                setSelectedEvent(undefined);
                            }}
                            // apiState={servicesState}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

