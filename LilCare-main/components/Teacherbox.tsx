import React from "react";
import parent from "@/image/home-3_section_01_1-e1679233217936.png";
import "@/css/TeacherBox.css";
import { UserAuthData, UsersAuthSelect } from "@/types";
import { User } from "@supabase/supabase-js";

type Props = {
  educator : UsersAuthSelect
}
function Teacherbox({educator}: Props) {
  return (
    <div className="Teacherbox">
      <img src={educator.rawUserMetaData.photo} alt=""></img>
      <div className="information">
        <p className="name">{educator.rawUserMetaData.lastName + " " + educator.rawUserMetaData.firstName}</p>
        <p className="qualification ">
          {educator.rawUserMetaData.username}
        </p>
        <p className="Hire-Date">Joined {(new Date(educator?.createdAt!)).toDateString()}</p>
      </div>
    </div>
  );
}

export default Teacherbox;
