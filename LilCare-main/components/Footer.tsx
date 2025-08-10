import React from "react";
import "@/css/footer.css";
import logo from "@/image/logo versed colors.png";
import footerImage1 from "@/image/Image (18).png";
import footerImage2 from "@/image/Image (19).png";
import footerImage3 from "@/image/Image (20).png";
import footerImage4 from "@/image/Image (21).png";
import footerImage5 from "@/image/Image (22).png";
import footerImage6 from "@/image/Image (23).png";
import footerImage7 from "@/image/Image (24).png";
import footerImage8 from "@/image/Image (25).png";
import footerImage9 from "@/image/Image (27).png";
import footerImage10 from "@/image/Image (28).png";

function Footer() {
  return (
    <div className="Footer">
      <div className="container">
        <img src={footerImage1.src} alt=""></img>
        <img src={footerImage2.src} alt=""></img>
        <div className="gride">
          <div className="part">
            <img src={logo.src} alt="" className="logo"></img>
            <p className="specText">
              Come visit The Little Dino centre for yourself so you can tour the
              rooms and meet some of our educators. we offer hight quality early
              education{" "}
            </p>
          </div>
          <div className="part">
            <p className="miniTitre"> our contacts</p>
            <div className="contact">
              <img src={footerImage9.src} alt=""></img>
              <p className="specText">
                27 Division st,new york <br />
                NY 100002, USA{" "}
              </p>
            </div>
            <div className="contact">
              <img src={footerImage10.src} alt=""></img>

              <p className="specText">
                +213 659882471 <br />
                +213 524546515
              </p>
            </div>
            <div className="contact">
              <p className="specText">Little-Dino@gmail.com</p>
            </div>
          </div>
          <div className="part">
            <p className="miniTitre"> our gallery</p>
            <div className="galery">
              <div>
                <img src={footerImage3.src} alt=""></img>
                <img src={footerImage4.src} alt=""></img>
                <img src={footerImage5.src} alt=""></img>
              </div>
              <div>
                <img src={footerImage6.src} alt=""></img>
                <img src={footerImage7.src} alt=""></img>
                <img src={footerImage8.src} alt=""></img>
              </div>
            </div>
          </div>
        </div>
        <p className="specText copy">
          Copyright 2024 LittleDino by our group ,All rights Reserved
        </p>
      </div>
    </div>
  );
}

export default Footer;
