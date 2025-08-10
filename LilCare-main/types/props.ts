// In this file I will define the types of the props that I will use in the components

import { ChatInsert, ChildInsert, DiscountData, DiscountInsert, EducationalScheduleInsert, EventInsert, InvoiceInsert, JobInsert, MessageInsert, ModuleInsert, NotificationInsert, ScheduleInsert, SeasonInsert, SectionData, SectionInsert, ServiceData, ServiceInsert, UserAuthData, UserAuthInsert } from "./";



        // Forms  Props

export type SectionFormProps = {
    onSubmit: (data: SectionInsert) => void
    onCancel: () => void
}

export type ChatFormProps = {
    onSubmit: (data: ChatInsert) => void
    onCancel: () => void
}

export type MessageFormProps = {
    onSubmit: (data: MessageInsert) => void
    onCancel: () => void
}

export type DiscountFormProps = {
    onSubmit: (data: DiscountInsert) => void
    onCancel: () => void
}

export type ServiceFormProps = {
    onSubmit: (data: ServiceInsert) => void
    onCancel: () => void
}



export type InvoiceFormProps = {
    onSubmit: (data: InvoiceInsert) => void
    onCancel: () => void
    services: ServiceData[],
    discounts: DiscountData[],
    receipents: UserAuthData[]
}

export type ChildFormProps = {
    onSubmit: (data: ChildInsert) => void
    onCancel: () => void
    sections: SectionData[]
    parents: UserAuthData[]
}

export type EventFormProps = {
    onSubmit: (data: EventInsert) => void
    onCancel: () => void
    
}

export type ScheduleFormProps = {
    onSubmit: (data: ScheduleInsert) => void
    onCancel: () => void

}

export type JobFormProps = {
    onSubmit: (data: JobInsert) => void
    onCancel: () => void
}

export type ModuleFormProps = {
    onSubmit: (data: ModuleInsert) => void
    onCancel: () => void
}

export type SeasonFormProps = {
    onSubmit: (data: SeasonInsert) => void
    onCancel: () => void
}

export type UserAuthFormProps = {
    onSubmit: (data: UserAuthInsert) => void
    onCancel: () => void

}

export type EducationalScheduleFormProps = {
    onSubmit: (data: EducationalScheduleInsert) => void
    onCancel: () => void
}

export type NotificationFormProps = {
    onSubmit: (data: NotificationInsert) => void
    onCancel: () => void
    
}