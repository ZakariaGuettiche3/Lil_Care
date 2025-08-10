"use client";
import { Children } from "@/types";
import {
  useChildrenTable,
  useSessionUser
} from "@/lib/hooks";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { usePDF } from "react-to-pdf";
import Link from "next/link";
import ChildBadge from "../ChildBadge";
import CustomTableFooter from "./CustomTableFooter";

type Props = {
  apiState: Children[];
  onSelect?: (data: Children[]) => void;
  title?: string;
};

export default function ChildrenTable({ onSelect, apiState, title }: Props) {
  const { toPDF, targetRef } = usePDF({
    filename: `children_table.pdf`,
  });

  const tableState = useChildrenTable((state) => ({ ...state, data: apiState }));

  const {
    selectedRows,
    itemsPerPage,
    selectAll,
    rows,
    deselectAll,
    deselectRow,

    getSelectedRows,
    addToSelectedRows,
  } = tableState;


  const { currentUser } = useSessionUser();
  useEffect(() => {
    const data = apiState
    console.log( (apiState.length ))
    if (data) {
      useChildrenTable.setState({data : apiState, rows: apiState?.slice(0, itemsPerPage), pageCount: Math.floor((data.length ) / itemsPerPage) + 1});

    }
  },[apiState])


  return (
    <>
      <div className="flex gap-3 my-3 justify-end w-full">
        <ChildBadge child={selectedRows?.at(0)} />
        <Button onClick={() =>{toPDF({"page": {"orientation": "landscape", "margin": {"top": 20, "left": 20, "bottom": 20 , "right": 20}} , "canvas": {"logging": true, "qualityRatio": 16/9}})}}>
          Export Table
        </Button>
      </div>
      <Card ref = {targetRef} x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>{title || "Children"}</CardTitle>
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
                    }}
                    className="w-4"
                  />
                </TableHead>
                <TableHead className="w-[100px] sm:table-cell text-center">
                  image <span className="sr-only">Image</span>
                </TableHead>
                <TableHead className="text-center">Full Name</TableHead>
                {/* <TableHead className="hidden md:table-cell">Phone</TableHead> */}

                <TableHead className="hidden md:table-cell text-center">
                  Birthdate
                </TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Section
                </TableHead>
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows?.map((child) => (
                <TableRow
                  aria-checked={getSelectedRows().includes(child)}
                  key={child.id}
                >
                  <TableCell className="w-[30] flex-shrink-0">
                    <Checkbox
                      checked={selectedRows.includes(child)}
                      onCheckedChange={(e: boolean) => {
                        e ? addToSelectedRows(child) : deselectRow(child);
                        console.log(getSelectedRows());
                        onSelect?.(getSelectedRows());
                      }}
                      className="w-4"
                    />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <img
                      alt="parent image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={child?.photo || undefined}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-center">
                  <Link href={`/${currentUser?.user_metadata?.role?.toLowerCase()}/children/${child.id}`}>
                    {child.lastName + " " + child.firstName}
                    </Link>
                  </TableCell>
                  {/* <TableCell className="text-center">{child.phone}</TableCell> */}
                  <TableCell className="hidden text-center md:table-cell">
                    {child.birthDate}
                  </TableCell>
                  <TableCell className="hidden text-center md:table-cell">
                    {child.section.name}
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
       <CustomTableFooter {...tableState}  />
      </Card>
    </>
  );
}
