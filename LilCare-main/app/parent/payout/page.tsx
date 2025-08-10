import Sidebar from "@/components/Sidebar";
import DiscountCard from "@/components/cards/DiscountCard";
import ServiceCard from "@/components/cards/ServiceCard";
import InvoiceForm from "@/components/forms/payment/InvoiceForm";
import { DiscountDialog } from "@/components/modals/DiscountDialog";
import InvoiceTable from "@/components/tables/InvoicesTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  createInvoices,
  getDiscounts,
  getInvoices,
  getServices,
} from "@/server/payment";
import { getParents } from "@/server/users";
import { supabaseServer } from "@/lib/supabase/server";
import Link from "next/link";
import ServiceDialog from "@/components/modals/ServiceDialog";
import {PageTabs} from "@/lib/constant";
import {redirect} from "next/navigation";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

const Page = async ({ searchParams }: Props) => {
  const supabase = await supabaseServer();





  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const invoices =  await getInvoices({receipent: currentUser?.user_metadata.customerId }) ;

  return (
    <div className="flex h-full">
      <Sidebar active="Payout" />
      <div className="container main p-4">

            <InvoiceTable apiState={invoices} currentUser={currentUser!} />

      </div>
    </div>
  );
};

export default Page;
