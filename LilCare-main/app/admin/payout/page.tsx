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

  const tab = searchParams.tab;

  if (!tab || !PageTabs.payout.tabs.includes(tab) ){
    redirect(`/admin/payout?tab=${PageTabs.payout.defaultTab}`)
    return;
  }


  const [services, invoices, discounts, customers] = await Promise.all([getServices(), getInvoices(), getDiscounts(), getParents()]);

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-full">
      <Sidebar active="Payout" />
      <div className="container main p-4">
        <Tabs defaultValue={tab}>
          <TabsList className="bg-inherit">
            <TabsTrigger value="services">
              <Link className="p-2" href="/admin/payout?tab=services">Services</Link>
            </TabsTrigger>
            <TabsTrigger value="discounts">
              <Link className="p-2" href="/admin/payout?tab=discounts">Discounts</Link>
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <Link className="p-2" href="/admin/payout?tab=invoices">Invoices</Link>
            </TabsTrigger>
            <TabsTrigger value="send invoice">
              <Link className="p-2" href="/admin/payout?tab=send invoice">Invoice Form</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="services">
            <div className="p-4">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Services</h2>
                <ServiceDialog />
              </div>
              <ul className="grid grid-cols-auto gap-3">
                {services?.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="discounts">
            <div className="p-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Discounts</h2>
                <DiscountDialog />
              </div>
              <ul className="grid grid-cols-auto gap-3">
                {discounts?.map((discount) => (
                  <DiscountCard key={discount.id} discount={discount} />
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="invoices">
            <InvoiceTable apiState={invoices} currentUser={currentUser!} />
          </TabsContent>
          <TabsContent value="send invoice">
            <div className="p-4">
              <InvoiceForm
                services={services}
                discounts={discounts}
                customers={customers}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Page;
