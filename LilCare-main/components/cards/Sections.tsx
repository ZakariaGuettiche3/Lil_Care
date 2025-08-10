"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import { SectionData } from "@/types";

type Props = {
  sections: SectionData[];
};

const SectionCard = (section: SectionData) => {
  return (
    <Card>
      <img
        className="w-full"
        style={{ aspectRatio: "16/9" }}
        src={section.photo}
      />
      <CardHeader>
        <div className="flex">
          <Link href={`${window.location.pathname}?sectionId=${section.id}`}>
            <CardTitle className="mr-auto"> {section.name} </CardTitle>
          </Link>
        </div>
      </CardHeader>
      <CardContent>{section.description}</CardContent>
      <CardFooter className="flex justify-between">

        <h2>
          {" "}
          <span className="text-red-600 text-[16px]">Age : </span>
          {section.age}
          <span> Year</span>{" "}
        </h2>
        
        <h2>
          {" "}
          <span className="text-red-600 text-[16px]">Seat : </span>{" "}
          {section.seats}{" "}
        </h2>
      </CardFooter>
    </Card>
  );
};

const Sections = (props: Props) => {
  return (
    <div className="mt-2">
      <ul className="grid grid-cols-auto gap-2">
        {props?.sections.map((service, id) => {
          return <SectionCard key={id} {...service} />;
        })}
      </ul>
    </div>
  );
};

export default Sections;
