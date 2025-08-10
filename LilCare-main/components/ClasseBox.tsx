import React from "react";
import clas from "@/image/Image (10).png";
import "@/css/classbox.css";
import Link from "next/link";
import { Section, SectionData } from "@/types";

function ClasseBox({section}: {section : SectionData}) {
  return (
    <div className="ClasseBox">
      <img src={section.photo} alt=""></img>
      <div className="info2">
        <p className="name">{section.name}</p>
        <p className="descrp">
          {section.description}
        </p>
        <Link href="" className="specbtn">
          Programme
        </Link>
        <div className="price">
          <p className="seat">disponible seat: {section?.seats}</p>

          <p className="prix">{section?.metadata?.prices?.at(0)?.price}</p>
        </div>
      </div>
      <div className="join f-centre">
        <Link href="/auth" className="">
          Enroll
        </Link>
      </div>
    </div>
  );
}

export default ClasseBox;
