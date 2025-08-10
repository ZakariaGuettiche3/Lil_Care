"use client";
import { PreregistrationData } from "@/types";
import { usePreregistrationTable } from "@/lib/hooks";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  PaginationLink,
  PaginationNext,
} from "../ui/pagination";
import { Button } from "@/components/ui/button";
import { clickOn } from "@/lib/helpers";
import { PreRegistrationDialog } from "../modals/PreRegistrationDialog";
import CustomTableFooter from "./CustomTableFooter";

type Props = {
  apiState: PreregistrationData[];
  onSelect?: (data: PreregistrationData[]) => void;
  title?: string;
};

export default function PreregistrationTable({
  onSelect,
  apiState,
  title,
}: Props) {

  const tableState = usePreregistrationTable((state) => state)
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

  usePreregistrationTable.subscribe((state, prev) => {
    onSelect?.(state.getSelectedRows());
  });

  useEffect(() => {
    const data = apiState;
    console.log(data);

    if (data) {
      console.log({ pageCount: Math.floor(data?.length / itemsPerPage) + 1 });
      usePreregistrationTable.setState({
        data: apiState,
        rows: apiState?.slice(0, itemsPerPage),
        pageCount: Math.floor(data?.length / itemsPerPage) + 1,
      });
    }
  }, [apiState]);

  const pageIndex = currentPage - 1;

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>{title || "Preregistrations"}</CardTitle>
        <CardDescription>
          Manage your preregistrations and view their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex-shrink-0">
                <Checkbox
                  onCheckedChange={(e) => {
                    e ? selectAll() : deselectAll();

                    console.log({ selectedRows: getSelectedRows() });
                  }}
                  className="w-4"
                />
              </TableHead>
              <TableHead className="text-center">Parent Name</TableHead>
              <TableHead className="text-center">Child Name</TableHead>
              <TableHead className="text-center">Child Birthdate</TableHead>
              <TableHead className="text-center">Child Gender</TableHead>
              <TableHead className="text-center">Paid</TableHead>
              <TableHead className="text-center">Confirmed</TableHead>
              <TableHead className="text-center">Actions</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {rows?.map((preregistration) => (
              <TableRow
                aria-checked={getSelectedRows().includes(preregistration)}
                key={preregistration?.id}
              >
                <TableCell className="w-[30] flex-shrink-0">
                  <Checkbox
                    onCheckedChange={(e) => {
                      e
                        ? addToSelectedRows(preregistration)
                        : deselectRow(preregistration);
                      console.log(getSelectedRows());
                      onSelect?.(getSelectedRows());
                    }}
                    className="w-4"
                    checked={getSelectedRows().includes(preregistration)}
                  />
                </TableCell>
               
                <TableCell className="text-center">
                  {preregistration?.parentLastName +
                    " " +
                    preregistration?.parentFirstName}
                </TableCell>
                
                <TableCell className="text-center">
                  {preregistration?.childLastName +
                    " " +
                    preregistration?.childFirstName}
                </TableCell>
                <TableCell className="text-center">
                  {preregistration?.childBirthDate}
                </TableCell>
                <TableCell className="text-center">
                  {preregistration?.childGender}
                </TableCell>
                <TableCell className="text-center">
                  {preregistration?.paid ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-center">
                  {preregistration?.confirmed ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() => {
                      setInAction?.(preregistration);
                      clickOn("preregister-trigger");
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <PreRegistrationDialog />
      <CustomTableFooter {...tableState} />
    </Card>
  );
}
