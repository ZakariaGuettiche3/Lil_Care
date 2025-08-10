"use client";
import Header from "@/components/Header";
import "@/css/Home.css";
import parentImage from "@/image/home-3_section_01_1-e1679233217936.png";
import geoImage from "@/image/geolocalization.png";
import cafe from "@/image/coffe circle.png";
import parent from "@/image/parent area.png";
import start from "@/image/Image (3).png";
import balon from "@/image/Image (1).png";
import Footer from "@/components/Footer";
import Teacherbox from "@/components/Teacherbox";
import ClasseBox from "@/components/ClasseBox";
import palnet from "@/image/Image (13).png";
import Link from "next/link";
import { sections } from "../db/modules/curriculum";
import { toast } from "sonner";
import { useApi } from "@/lib/hooks";
import { getEducators } from "@/server/users";
import { getEvents } from "@/server/events";
import { getSections } from "@/server/sections";
import NewsBox from "./NewsBox";
import {
  EducatorData,
  EventData,
  EventSelect,
  SectionData,
  UserAuthData,
  UsersAuthSelect,
} from "@/types";
import { useEffect } from "react";
// import Link from "next/link";

function Home({
  sections,
  events,
  educators,
  prerigister
}: {

  sections: SectionData[];
  events: EventData[];
  educators: UsersAuthSelect[];
  prerigister?: boolean;
}) {
  // const educatorsState = useApi(getEducators,[])

  // const eventsState = useApi(getEvents,[])

  // const sectionsState = useApi(getSections,[]);

  useEffect(() => {

    if (prerigister) {
      toast.success("You have successfully pre-registered, we will contact you soon");
    } else {
      if (prerigister === false) {
      toast.error("You have not successfully pre-registered, please try again");
      }
    }
  },[])
  return (
    <div className="AllContainer">
      <div className="Home AllContainer">
        <Header />
        <div className="container landing f-arounde">
          <div className="text">
            <p>welcome to littelangels</p>
            <p>
              best <span>play</span> <br /> <span>Area</span> for kids
            </p>
            <Link href="" className="specbtn">
              Read More
            </Link>
          </div>
          <div className="homeimage"></div>
        </div>
      </div>
      <div className="body">
        <div className="info">
          <div className="container">
            <div className="box">
              <img src={geoImage.src} alt=""></img>
              <p className="miniTitre">Geolocalization system</p>
              <p className="specText">
                children with better pre-reading skills, richer vocabularies
              </p>
              <Link href="">Read More</Link>
            </div>
            <div className="box">
              <img src={cafe.src} alt=""></img>
              <p className="miniTitre">children cafe</p>
              <p className="specText">
                children with better pre-reading skills, richer vocabularies
              </p>
              <Link href="">Read More</Link>
            </div>
            <div className="box">
              <img src={parent.src} alt=""></img>
              <p className="miniTitre">parent areas</p>
              <p className="specText">
                children with better pre-reading skills, richer vocabularies
              </p>
              <Link href="">Read More</Link>
            </div>
          </div>
          <div className="footer-S-1"></div>
        </div>
        <div className="place">
          <div className="container ">
            <div className="parent-image">
              <img src={parentImage.src} alt=""></img>
              <div className="Sous-image">
                <p className="miniTitre">happy hours</p>
                <p className="specText">Sun-Wed ......9:00-17:00</p>
                <p className="specText">Thu ...............9:00-12:00 </p>

                <p className="specText"> Sat ................9:00-14:00</p>
              </div>
            </div>
            <div className="parent-desc">
              <p className="MainTitre">
                {" "}
                a favorite place <br /> for fun and joy
              </p>
              <p className="specText2">
                Look into the eyes of a young child and see the sparkle and
                wonder . Develop these passions and watch the adult bloom into
                someone special .AT Littledino Centre ,we work every day to
                build the foundations for amazing futures.
              </p>
              <Link href="" className="specbtn">
                Read More
              </Link>
            </div>
          </div>
        </div>
        <div className="offre">
          <div className="container">
            <img src={start.src} alt=""></img>
            <img src={balon.src} alt=""></img>
            <p className="MainTitre">what we offer</p>
            <p
              className="specText2"
              style={{
                marginBottom: "0px",
              }}
            >
              The LittleDino&apos;s mission is to provide affordable , high-quality
              early education and <br />
              childcare services for working families to ensur every child
            </p>
          </div>
        </div>
        <div className="teacher-area">
          <div className="container">
            <div className="Titre f-between">
              <p className="MainTitre ">Our teacher</p>
              <Link href="" className="specbtn">
                View More
              </Link>
            </div>
            <div className="our-techer">
              {educators?.map((educator, idx) => (
                <Teacherbox key={idx} educator={educator} />
              ))}
            </div>
          </div>
        </div>
        <div className="classe-area">
          <img src={palnet.src} alt="" className="planet"></img>
          <div className="container">
            <p className="miniTitre">Our Classes</p>
            <div className="our-class">
              {sections?.map((section, idx) => (
                <ClasseBox key={idx} section={section} />
              ))}
            </div>
          </div>
        </div>
        <div className="news-area">
          <div className="container">
            <div className="f-between Titre">
              <p className="MainTitre ">Our Latest News</p>
              <Link href="" className="specbtn">
                View More
              </Link>
            </div>
            <div className="our-news">
              {events?.map((event, idx) => (
                <NewsBox key={idx} event={event as EventSelect} />
              
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
