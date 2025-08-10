"use server";
import {
  Preregistrations,
  customers,
  discounts,
  invoices,
  price,
  services,
  subscriptions,
  usersAuth,
} from "@/db/modules";
import { addMonths, addYears, format } from "date-fns"; // Assuming you're using date-fns for date manipulation

import {
  Checkout,
  Concrete,
  CustomerData, CustomerInsert,
  DiscountData,
  DiscountInsert,
  InvoiceData,
  InvoiceInsert,
  PriceData,
  ServiceData,
  ServiceInsert,
  SubscriptionInsert,
} from "@/types";
import { db } from "@/db";
import { z } from "zod";
import {
  InvoiceFormSchema,
  PreregestrationsSchema,
  ServiceInsertSchema,
  ServiceSelectSchema,
} from "@/db/forms/formsSchema";
import { eq, getTableColumns } from "drizzle-orm";
import { CreatePriceParams } from "@/vendor/chargily/src/types/param";
import { chargily } from "./chargily";
import { toSql } from "@/lib/utils";
import axios from "axios";
import { CHARGILIY_SK } from "@/lib/constant";
import {Balance} from "@/vendor/types/data";


export const createService = async (params: z.infer<typeof ServiceInsertSchema>
)=> {
  // create producet in chargily
  try {
    const productParams = {
      images: params.Images,
      name: params.name,
      description: params.description,
      metadata: { prices: JSON.stringify(params.prices) },
    };
    const product = await chargily.createProduct(productParams);
    // create service in my db
    const service = await db
      .insert(services)
      .values({
        id: product.id,
        name: params.name,
        description: params.description,
        dtype: params.dtype,
        Images: params.Images,
        metadata: { prices: params.prices },
      } as ServiceInsert)
      .returning(getTableColumns(services));

    const pricesParams: CreatePriceParams[] = params?.prices?.map((price) => ({
      product_id: product.id,
      amount: price.price!,
      currency: "dzd",
    }));

    const insertedPrices = await Promise.all(
      pricesParams?.map((price) => chargily.createPrice(price))
    );

    const serviceId = service?.at(0)?.id!;
    const prices = insertedPrices.map((price, index) => ({
      id: price.id,
      service_id: serviceId,
      type: params.prices[index].type,
      price: params.prices[index].price,
    }));
    const response = await db
      .insert(price)
      .values(prices)
      .returning(getTableColumns(price));

    const res = await db
      .update(services)
      .set({ metadata: { prices: response } })
      .where(eq(services.id, serviceId));
    return  {data: {service: service.at(0)!, prices : response}, error: null };
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    return {data: null , error: err.message };
  }
};

export const updateService = async (
  params: z.infer<typeof ServiceSelectSchema> & { prices: PriceData[] }
) => {
  // create producet in chargily
  const product = await chargily.updateProduct(params.id, {
    images: params.Images,
    name: params.name,
    description: params.description,
    metadata: params.metadata,
  });
  // create service in my db
  const service = await db
    .update(services)
    .set({
      id: product.id,
      name: params.name,
      description: params.description,
      dtype: params.dtype,
      metadata: params.metadata,
    } as ServiceInsert)
    .returning(getTableColumns(services));

  const pricesParams: CreatePriceParams[] = params?.prices?.map((price) => ({
    product_id: product.id,
    amount: price.price!,
    currency: "DZD",
  }));

  const insertedPrices = await Promise.all(
    pricesParams?.map((price) => chargily.createPrice(price))
  );
};

export const getServices = async (params?: Concrete<ServiceData>) => {
  const query = toSql(services, params);
  const servicesColumns = getTableColumns(services);
  const sql = db
    .select({ ...servicesColumns, prices: price })
    .from(services)
    .leftJoin(price, eq(price.service_id, services.id));
  if (!query) return sql;
  const results = await sql.where(query);
  return results;
};

export const getDiscounts = async (params?: Concrete<DiscountData>) => {
  const query = toSql(discounts, params);
  if (!query) return await db.select().from(discounts);
  const results = await db.select().from(discounts).where(query);
  return results;
};

export const createDiscount = async (params: DiscountInsert) => {
  try {
    const results = await db
      .insert(discounts)
      .values(params)
      .returning(getTableColumns(discounts));
    return { data: results, error: null };
  } catch (error) {
    const err = error as Error;
    return { data: null, error: err?.message };
  }
};

export const getInvoices = async (params?: Concrete<InvoiceData>) => {
  const query = toSql(invoices, params);
  if (!query) return await db.select().from(invoices);
  const results = await db.select().from(invoices).where(query);
  return results;
};

export const createInvoices = async (
  params: z.infer<typeof InvoiceFormSchema>[]
) => {
  try {
    console.log(params);
    const data: InvoiceInsert[] = params.map(
      (item) =>
        ({
          date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          customer_id: item?.receipent?.id!,
          service_id: item.service.id,
          price: item.price?.id!,
          discount: item.discount?.id,
          metadata: {
            customer: item.receipent!,
            price: item.price!,
            service: {
              ...item.service,
              Images: item.service.Images,
            },
          },
        } as InvoiceInsert)
    );

    const results = await db
      .insert(invoices)
      .values(data)
      .returning(getTableColumns(invoices));
    return { data: results, error: null };
  } catch (error) {
    const err = error as Error;
    return { data: null, error: err?.message };
  }
};

export const createCheckout = async (params: InvoiceData[], successfullUrl: string) => {
  const response = await chargily.createCheckout({
    items: params.map((item) => ({
      price: item.price!,
      quantity: 1,
    })),
    success_url: `${successfullUrl}/parent/payout?success=true`,
    customer_id: params.at(0)?.metadata.customer.id,
    percentage_discount: params.at(0)?.discount!,
  });
  return response;
};

export const PreRegister = async (
  params: z.infer<typeof PreregestrationsSchema>, successfullUrl: string
) => {
  try {
    // first step in preregistration create customer account chargily
    const chargilyCustomer = await chargily.createCustomer({
      email: params.parentEmail,
      name: params.parentLastName + " " + params.parentFirstName,
      phone: params.parentPhone,
    });

    const { id, name, email, phone } = chargilyCustomer;
    // second step in preregistration create customer row in my db
    if (!chargilyCustomer) return {data: null , error: "Customer not created"};

    const customer : CustomerInsert = {
      ...chargilyCustomer, phone: phone || "", email: email || ""
    }
    const myCustomer = await db
      .insert(customers)
      .values(customer)
      .returning(getTableColumns(customers));
    if (!myCustomer) return {data: null, error :"Customer not created in my db"};
    // third step in preregistration create row in preregistration table
    const results = await db
      .insert(Preregistrations)
      .values(params)
      .returning(getTableColumns(Preregistrations));
    if (!results) throw new Error("Preregistration not created in my db");

    const invoice = (
      await db
        .insert(invoices)
        .values({
          date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          receipent: id,
          service_id: "01hybxvsnyx5wkrsdx04chxbv3",
          price: "01hybxvvnbqna78kp2vczqwp3s",
          metadata: {
            customer: customer,
            price: {
              id: '01hybxvvnbqna78kp2vczqwp3s',
              service_id: "01hybxvsnyx5wkrsdx04chxbv3",
              type: "Month",
              price: 1000,
            },
          },
        } as InvoiceInsert)
        .returning(getTableColumns(invoices))
    ).at(0);

    if (!invoice) throw new Error("Invoice not created in my db");
    const checkout = await chargily.createCheckout({
      items: [
        {
          price: "01hybxvvnbqna78kp2vczqwp3s",
          quantity: 1,
        },
      ],
      success_url: `http://${successfullUrl}/Registration?invoice=${invoice.id}&success=true`,
      customer_id: id,
      percentage_discount: 0,
    });
    return { data: checkout, error: null };
  } catch (error) {
    const err = error as Error;
    return { data: null, error: err?.message };
  }
};

export async function PaidInvoice(params: {
  checkout_id: string;
  invoice: string;
}) {
  const checkout = await chargily.getCheckout(params.checkout_id);
  if (checkout.status === "paid") {
    const invoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, parseInt(params.invoice)));
    if (invoice) {
      const result = await db
        .update(invoices)
        .set({
          status: "Paid",
        })
        .where(eq(invoices.id, parseInt(params.invoice)))
        .returning(getTableColumns(invoices));
      const email = result.at(0)?.metadata.customer.email!;
      await db
        .update(Preregistrations)
        .set({ paid: true })
        .where(eq(Preregistrations.parentEmail, email));
      return result;
    }
  }
  return null;
}

export const SubscripeInService = async (params: {
  price: PriceData;
  customer_id: string;
  successfullUrl: string;
}) => {
  const service = await db
    .select()
    .from(services)
    .where(eq(services.id, params.price.service_id));

  console.log({customer_id: params.customer_id});
  
  const customer = (
    await db
      .select()
      .from(customers)
      .where(eq(customers.id, params.customer_id))
  ).at(0);

  if (service && customer) {
    const currentDate = new Date();

    const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");

    const invoice = (
      await db
        .insert(invoices)
        .values({
          date: formattedDate,
          receipent: params.customer_id,
          service_id: params.price.service_id,
          price: params.price.id,
          metadata: {
            customer: customer,
            price: params.price,
          },
        } as InvoiceInsert)
        .returning(getTableColumns(invoices))
    ).at(0);

    const checkout = await chargily.createCheckout({
      items: [
        {
          price: params.price.id,
          quantity: 1,
        },
      ],
      success_url: `http://${params.successfullUrl}/parent/${"events"}?invoice=${
        invoice?.id
      }&success=true`,
      customer_id: params.customer_id,
      percentage_discount: 0,
    });

    return checkout;
  }
  console.log({customer, service})
 throw new Error("Service or customer not found")
};

export const confirmSubscription = async (params: {
  checkout_id: string;
  invoice: string;
  userId: string
}) => {
  const checkout = await chargily.getCheckout(params.checkout_id);
  if (checkout.status === "paid") {
    const invoice = (
      await db
        .select()
        .from(invoices)
        .where(eq(invoices.id, parseInt(params.invoice)))
    ).at(0);
    if (invoice) {
      const result = await db
        .update(invoices)
        .set({ status: "Paid" })
        .where(eq(invoices.id, parseInt(params.invoice)))
        .returning(getTableColumns(invoices));
      const currentDate = new Date();
      let endDate: Date | null = null;

      switch (invoice.metadata.price.type) {
        case "Month":
          endDate = addMonths(currentDate, 1);
          break;
        case "Year":
          endDate = addYears(currentDate, 1);
          break;
        case "Quarter":
          endDate = addMonths(currentDate, 3);
          break;
        case "Once":
          endDate = currentDate; // or endDate = null if you don't need an end date for "Once"
          break;
      }

      const formattedDate = format(currentDate, "yyyy-MM-dd HH:mm:ss");
      const formattedEndDate = endDate
        ? format(endDate, "yyyy-MM-dd HH:mm:ss")
        : null;
      const subsription = await db
        .insert(subscriptions)
        .values({
          service_id: invoice.metadata.price.service_id,
          user_id: params.userId,
          price_id: invoice.metadata.price.id,
          start_date: formattedDate,
          end_date: formattedEndDate,
          status: "Active",
        } as SubscriptionInsert)
        .returning(getTableColumns(subscriptions));

      return subsription;
    }
  }
  return null;
};

export const getSubscriptions = async (
  params?: Concrete<SubscriptionInsert>
) => {
  const query = toSql(subscriptions, params);
  const sql = db
    .select({
      ...getTableColumns(subscriptions),
      customer: usersAuth,
      service: services,
    })
    .from(subscriptions)
    .leftJoin(usersAuth, eq(subscriptions.user_id, usersAuth.id))
    .leftJoin(services, eq(subscriptions.service_id, services.id));
  if (!query) return sql;
  const results = sql.where(query);
  return results;
};


export const getCustomers = async (params?: Concrete<CustomerData>) => {
  const query = toSql(customers, params);
  if (!query) return await db.select().from(customers);
  const results = await db.select().from(customers).where(query);
  return results;
}






export const getBalanceDetails = async () => {
  const balance = (
    await axios.get("https://pay.chargily.net/test/api/v2/balance", {
      headers: {
        Authorization:
          `Bearer ${CHARGILIY_SK}`,
      },
    })
  ).data as Balance;
  const transactions = (
    await axios.get("https://pay.chargily.net/test/api/v2/checkouts", {
      headers: {
        Authorization:
        `Bearer ${CHARGILIY_SK}`,
      },
    })
  ).data as { data: Checkout[] };

  console.log(transactions);
  return { balance, transactions };
};