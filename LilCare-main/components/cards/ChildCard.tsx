"use client"
import { Children } from "@/types";
import React from "react";
import { Card, CardContent, CustomImage } from "../ui";
import Link from "next/link";

type Props = {
  child?: Children;
};

function ChildCard({ child }: Props) {
  return (
    <Card>
      <CardContent className="p-2">
        <div className="flex items-center gap-3">
          <CustomImage
            src={child?.photo || undefined}
            alt={child?.firstName}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <Link href={`/parent/children?childId=${child?.id}`}>
              <h2 className="font-semibold">
                {child?.lastName + " " + child?.firstName}
              </h2>
            </Link>
            <Link href={`/admin/sections/${child?.section.id}`}>
              <p className="text-sm text-gray-500">{child?.section.name}</p>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChildCard;
