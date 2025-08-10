import { Role } from "@/types";
import { AppWindow, Baby, Calendar, FileText, Home, LineChart, LucideIcon, MessageSquare, UserRound, Users } from "lucide-react";

export const AdminSideItems = [
    { label: "Dashboard", href: "/admin/", Icon: Home },
     { label: "Profile", href: "/admin/profile", Icon: UserRound },

  { label: "Sections", href: "/admin/sections", Icon: Home },
    { label: "PreRegistrations", href: "/admin/preregestrations", Icon: AppWindow },
    
    { label: "Events", href: "/admin/events", Icon: Calendar },
    { label: "Parents", href: "/admin/parents", Icon: UserRound },
    { label: "Children", href: "/admin/children", Icon: Baby },
    { label: "Messanger", href: "/admin/messanger", Icon: MessageSquare },
    { label: "Team", href: "/admin/team", Icon: Users },
    { label: "Payout", href: "/admin/payout", Icon: AppWindow },
    { label: "Cirruculiam", href: "/admin/cirruculiam", Icon: FileText },
  ];
  
  export const ParentSideItems = [
    { label: "Profile", href: "/parent/", Icon: Home },
    { label: "Events", href: "/parent/events", Icon: Calendar },
    { label: "Children", href: "/parent/children", Icon: Baby },
    { label: "Messanger", href: "/parent/messanger", Icon: MessageSquare },
    { label: "Payout", href: "/parent/payout", Icon: AppWindow },
  ];
  export const EducatorSideItems = [
    { label: "Dashboard", href: "/educator/", Icon: Home },
    { label: "Section", href: "/educator/section", Icon: FileText },
    { label: "Events", href: "/educator/events", Icon: Calendar },
    { label: "Students", href: "/educator/children", Icon: Baby },
    { label: "Calendar", href: "/educator/calendar", Icon: Calendar },
    { label: "Messanger", href: "/educator/messanger", Icon: MessageSquare },
  ];
  
  export const TherapistSideItems = [
    { label: "Dashboard", href: "/therapist/", Icon: Home },
    { label: "Sessions", href: "/therapist/sessions", Icon: FileText },
    { label: "Events", href: "/therapist/events", Icon: Calendar },

    { label: "Calendar", href: "/therapist/calendar", Icon: Calendar },
    { label: "Messanger", href: "/therapist/messanger", Icon: MessageSquare },
  ];
  
  export const PsychologistSideItems = [
    { label: "Dashboard", href: "/psychologist/", Icon: Home },
    { label: "Sessions", href: "/psychologist/sessions", Icon: FileText },
    { label: "Events", href: "/therapist/events", Icon: Calendar },
    { label: "Calendar", href: "/psychologist/calendar", Icon: Calendar },
    { label: "Messanger", href: "/psychologist/messanger", Icon: MessageSquare },
    { label: "Payout", href: "/psychologist/payout", Icon: AppWindow },
  ];
  
  export const AccountantSideItems = [
    { label: 'Dashboard', href: '/accountant/', Icon: Home },
    { label: 'Transactions', href: '/accountant/transactions', Icon: FileText },
    { label: 'Reports', href: '/accountant/reports', Icon: FileText },
    { label: 'Payouts', href: '/accountant/payouts', Icon: AppWindow },
    { label: 'Messanger', href: '/accountant/messanger', Icon: MessageSquare },
];

// Add to the sideItems object
export const sideItems: {
  [key in Role]: {
    label: string;
    href: string;
    Icon: LucideIcon;
  }[];
} = {
  ADMIN: AdminSideItems,
  PARENT: ParentSideItems,
  EDUCATOR: EducatorSideItems,
  THERAPIST: TherapistSideItems,
  PSYCHOLOGIST: PsychologistSideItems,
  ACCOUNTANT: AccountantSideItems,
};
  