"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ListAttributs = React.RefAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};
const List = React.forwardRef<HTMLUListElement, ListAttributs>(
  ({ className, ...props }, ref) => (
    <ul
      className={cn(
        "max-w-lg",
        className
      )}
      {...props}
      ref={ref}
    />
  )
);

List.displayName = "List";

type ListItemAttributs = React.RefAttributes<HTMLLIElement> & {
  className?: string;
  children?: React.ReactNode;
};
const ListItem = React.forwardRef<HTMLLIElement, ListItemAttributs>(
  ({ className, ...props }, ref) => (
    <li className={cn("pb-3 sm:pb-4", className)} {...props} ref={ref} />
  )
);

ListItem.displayName = "ListItem";

export { List, ListItem };
