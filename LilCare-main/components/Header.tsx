import React, { useEffect } from "react";
import logo from "@/image/logo versed colors.png";
import Link from "next/link";
import "@/css/Header.css";
import { useSessionUser } from "@/lib/hooks";

function Header() {
  const { currentUser: user } = useSessionUser();
  useEffect(() => {
    let Xmarck = document.querySelector("i");
    let burg = document.querySelector(".myburg");
    let List = document.querySelector("ul");
    burg?.addEventListener("click", () => {
      List?.classList.remove("close");
    });
    Xmarck?.addEventListener("click", () => {
      List?.classList.add("close");
    });
  }, []);
  return (
    <header className="open">
      <div className="container f-between">
        <img src={logo.src} alt="" />

        <ul className="close">
          <i className="fa-regular fa-circle-xmark"></i>
          <li>
            <Link href="" className="active">
              Home
            </Link>
          </li>
          <li>
            <Link href="">Parent Area</Link>
          </li>
          <li>
            <Link href="">About Us</Link>
          </li>
          <li>
            <Link href="">
              <span>Virtual Tour</span> <span></span>
            </Link>
          </li>
          <li>
            <Link href="">Contact</Link>
          </li>
        </ul>

        <div className="logeButton f-centre">
          {!user && (
            <Link className="specbtn" href="/signup">
              Pre-Register
            </Link>
          )}

          <Link
            className="specbtn"
            href={user ? user?.user_metadata?.role?.toLowerCase() : "/login"}
          >
            {user ? "Dashboard" : "Sign in"}
          </Link>
          <div className="myburg">
            <span className="a"></span>
            <span className="a"></span>
            <span className="a"></span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
