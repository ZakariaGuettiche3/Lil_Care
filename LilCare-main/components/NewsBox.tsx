import React from "react";
import clas from "@/image/Image (10).png";
import Link from "next/link";
import "@/css/newbox.css";
import { EventData, EventSelect } from "@/types";


function NewsBox({event}: {event : EventSelect}) {
  return (
    <div className="NewsBox">
      <img src={event.photo} alt=""></img>
      <div className="info2">
        <p className="publisher">
          {(new Date(event.metadata?.schedule.start!)).toDateString()}
        </p>
        <p className="Titre">{event.title}</p>
        <Link className="read" href="">
          Read More
        </Link>
      </div>
    </div>
  );
}

export default NewsBox;
