"use client";
import { useApi } from "@/lib/hooks";
import { getChildren } from "@/server/children";
import { ChildData, Concrete } from "@/types";
import React from "react";
import { Card, CardContent, CardHeader, CustomImage } from "./ui";
import { Baby } from "lucide-react";

type Props = {
  params: Concrete<ChildData>;
};

function ChildrenCard({ params }: Props) {
  const childrenState = useApi(async () => {
    const kids = await getChildren(params);
    return kids;
  }, [params]);

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>
        {childrenState?.data?.map((kid, id) => (
          <div key={id} className="flex items-center gap-4">
            <CustomImage className="" src={kid?.photo || undefined} Alt={<Baby />} />

            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {kid.lastName + " " + kid.firstName}
              </p>
              <p className="text-sm text-muted-foreground">
                {kid?.section?.name}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default ChildrenCard;
