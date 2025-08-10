"use client";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBalanceDetails } from "@/server/payment";
import { useApi } from "@/lib/hooks";
import { format } from "date-fns";
import { getChildren } from "@/server/children";
import { getEducators } from "@/server/users";
import { supabaseBrowser } from "@/lib/supabase/browser";
import ChatPresence from "@/components/chat/ChatPresence";
import { clickOn } from "@/lib/helpers";
import CardBarChart from "@/components/charts/CardBarChart";

type Props = {};

const Page = (props: Props) => {
  const { data } = useApi(getBalanceDetails, []);

  const childrenState = useApi(getChildren, []);
  const educatorsState = useApi(getEducators, []);

  useEffect(() => {
    const children = childrenState?.data
    const transactions = data?.transactions.data!
    
    console.log(transactions)
    if (children !== undefined) {
      console.log(children)


    }
   
  }, [childrenState?.data]);

  return (
    <div className="flex h-full">
      <Sidebar active="Dashboard" />

      <div className="flex w-full flex-col">
        <main className="overflow-auto flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card x-chunk="dashboard-01-chunk-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {" "}
                  {data?.balance?.wallets.at(0)?.balance} da{" "}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {educatorsState.data?.length}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p> */}
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Children</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {childrenState.data?.length}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                +19% from last month
              </p> */}
              </CardContent>
            </Card>
            <Card x-chunk="dashboard-01-chunk-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <ChatPresence />{" "}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p> */}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-3">
            <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
              <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>
                    Recent transactions from your store.
                  </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                  <Link href="#">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className=" sm:table-cell">
                      Type
                    </TableHead>
                    <TableHead className=" sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className=" sm:table-cell">
                      Date
                    </TableHead>
                    <TableHead className=" sm:table-cell">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  { data?.transactions.data?.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell className=" sm:table-cell">

                      <div className=" text-sm text-muted-foreground md:inline">
                        {transaction?.metadata?.cusomter}
                      </div>
                    </TableCell>
                        <TableCell className=" sm:table-cell">
                    </TableCell>
                        <TableCell className=" sm:table-cell">
                      <Badge className="text-xs" variant={transaction.status == "paid" ? "success" : "destructive"}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className=" md:table-cell lg:hidden xl:table-column">
                     {format(transaction.created_at * 1000, "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell className="text-right">{transaction.amount} da</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => {
                              // setInAction?.(invoice);
                              // clickOn("invoiceDetails");
                            }}
                          >
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                              // onClick={(e) => {
                              //   useInvoiceStore.setState({ ActionRow: invoice });
                              //   clickOn("invoice-trigger-edit");
                              // }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              clickOn("invoice-trigger-delete");
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  ))}
                  
                </TableBody>
              </Table>
            </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
