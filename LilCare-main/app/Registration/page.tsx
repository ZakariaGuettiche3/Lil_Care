import Home from "@/components/Home";
import Image from "next/image";
import "@/css/generale.css";
import "@/css/normal.css";
import "@/css/root.css";
import "@/css/root.css";
import { getSections } from "@/server/sections";
import { getEvents } from "@/server/events";
import { getEducators } from "@/server/users";
import { PaidInvoice } from "@/server/payment";

type Props = {
  searchParams: { checkout_id: string, success : "true" | "false", invoice: string };
};

export default async function Page({searchParams}: Props) {

  const [sections, events, educators] = await Promise.all([getSections(), getEvents(), getEducators()]);
  const {checkout_id, success, invoice} = searchParams;

  let paidCheckout = undefined;
  if (checkout_id && success && invoice) {
     paidCheckout = await PaidInvoice ({checkout_id, invoice});
  }

  console.log({searchParams})
  return (
    <main className="h-screen overflow-auto">
      <Home sections={sections}
        prerigister = {paidCheckout !== undefined ? !!paidCheckout : undefined}
        events={events}
        educators={educators} />
    </main>
  );
}
