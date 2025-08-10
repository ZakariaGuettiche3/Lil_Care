"use client";
import { ApiState, useInvoicesTable } from "@/lib/hooks";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "../ui/pagination";
import { clickOn } from "@/lib/helpers";
import { usePDF } from "react-to-pdf";
import { createCheckout } from "@/server/payment";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { User, UserResponse } from "@supabase/supabase-js";
// import InvoiceDetails from "./InvoiceDetails";
import { Badge } from "../ui/badge";
import { InvoiceData } from "@/types";
import CustomTableFooter from "./CustomTableFooter";

type Props = {
  apiState?: InvoiceData[];
  // columnsMaker: () => ColumnDef<Parent>[];
  onSelect?: (data: InvoiceData[]) => void;
  currentUser: User;

  title?: string;
};

export default function InvoiceTable({
  onSelect,
  currentUser,
  apiState,
  title,
}: Props) {
  const router = useRouter();
  const { toPDF, targetRef } = usePDF({
    filename: `invoice_table.pdf`,
  });

  const tableState = useInvoicesTable((state) => ({ ...state, data: apiState || [] }));

  const {
    currentPage,
    selectedRows,
    itemsPerPage,
    selectAll,
    rows,
    getRows,
    deselectAll,
    setInAction,
    deselectRow,
    listenData,
    getNextPage,
    getPreviousPage,
    getSelectedRows,
    addToSelectedRows,
    pageCount,
    setPageIndex,
  } = tableState;

  const pageIndex = currentPage - 1;

  useEffect(() => {
    const data = apiState;
    console.log(data);
    if (data) {
      console.log({ data });
      useInvoicesTable.setState({
        data: apiState,
        rows: apiState?.slice(0, itemsPerPage),
        pageCount: Math.floor(data?.length / itemsPerPage) + 1,
      });
    }
  }, [apiState]);

  // @ts-ignore
  return (
    <>
      <div className="flex gap-3 my-3 justify-end w-full">
        <Button
          onClick={() => {
            toPDF({
              page: {
                orientation: "landscape",
                margin: { top: 20, left: 20, bottom: 20, right: 20 },
              },
              canvas: { logging: true, qualityRatio: 16 / 9 },
            });
          }}
        >
          Export Table
        </Button>
        {currentUser?.user_metadata?.role == "PARENT" && <Button
            disabled={selectedRows.length === 0}
            onClick={(e) => {
              const items = selectedRows.map((row) => ({
                price: row.price!,
                quantity: 1,
              }));
              console.log(items);
              const customerId = currentUser?.user_metadata.customerId as string;
              createCheckout(selectedRows, window.location.host)
                  .then((checkout) => {
                    console.log({checkout});
                    router.replace(checkout.checkout_url);
                  })
                  .catch((error) => {
                  });
            }}
        >
          {" "}
          Pay{" "}
        </Button>}
      </div>
      <Card ref={targetRef} x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>{title || "Invoices"}</CardTitle>
          <CardDescription>
            Manage your products and view their sales performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="flex-shrink-0">
                  <Checkbox
                    onCheckedChange={(e) => {
                      e ? selectAll(rows) : deselectAll();
                      console.log({ selectedRows });
                    }}
                    className="w-4"
                  />
                </TableHead>
                <TableHead className="w-[100px] sm:table-cell text-center">
                  Inoivce Id <span className="sr-only">Inoivce Id</span>
                </TableHead>
                <TableHead className="text-center">Receipent</TableHead>
                {/* <TableHead className="hidden md:table-cell">Phone</TableHead> */}

                <TableHead className="hidden md:table-cell text-center">
                  Service
                </TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Total
                </TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Status
                </TableHead>
                <TableHead className="text-center">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <>
                {(!rows || rows?.length === 0) && (
                  <div className="w-full text-center">
                    {" "}
                    <p> No invoices available </p>
                  </div>
                )}
                {rows?.map((invoice) => (
                  <TableRow
                    aria-checked={getSelectedRows().includes(invoice)}
                    key={invoice.id}
                  >
                    <TableCell className="w-[30] flex-shrink-0">
                      <Checkbox
                        checked={selectedRows.includes(invoice)}
                        onCheckedChange={(e: boolean) => {
                          e ? addToSelectedRows(invoice) : deselectRow(invoice);
                          console.log(getSelectedRows());
                          onSelect?.(getSelectedRows());
                        }}
                        className="w-4"
                      />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {invoice?.id}
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {invoice.metadata?.customer?.name}
                    </TableCell>
                    <TableCell className="hidden text-center md:table-cell">
                      {invoice?.metadata?.service?.name!}
                    </TableCell>
                    <TableCell className="hidden text-center md:table-cell">
                      {invoice?.total_amount}
                    </TableCell>

                    <TableCell className="hidden text-center md:table-cell">
                      {invoice?.paid == invoice.total_amount ? (
                        <Badge variant={"success"}> Paid </Badge>
                      ) : (
                        <Badge variant={"destructive"}> Unpaid </Badge>
                      )}
                    </TableCell>
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
                              setInAction?.(invoice);
                              clickOn("invoiceDetails");
                            }}
                          >
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              useInvoicesTable.setState({ ActionRow: invoice });
                              clickOn("invoice-trigger-edit");
                            }}
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
              </>
            </TableBody>
          </Table>
          {/* <InvoiceDetails /> */}
        </CardContent>
        {/* <EditAlert /> */}
        <CustomTableFooter {...tableState}  />

      </Card>
    </>
  );
}
