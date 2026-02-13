import React, { useRef } from "react";
import styles from "./Footer.module.css";
import PlusMarker from "../PlusMarker/PlusMarker";
import FooterLogo from "./FooterLogo";
import cloud from "../../assets/cloud.svg";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Footer() {
  const logoContainer = useRef();
  const logo = useRef();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      logo.current,
      { opacity: 0, scale: 0.99, filter: "blur(24px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
        scrollTrigger: {
          trigger: logoContainer.current,
          // scrub: true,
          start: "+50% bottom",
          end: "bottom bottom",
          toggleActions: "play none play reverse",
        },
      }
    );
  });

  return (
    <footer>
      <div className={styles.container}>
        <div className={styles.image} />
        <div className={styles.author}>
          <PlusMarker />
          <p>Website by Alessandro Locatelli</p>
          <PlusMarker />
        </div>
        <div className={styles.logo} ref={logoContainer}>
          <div ref={logo}>
            <FooterLogo />
          </div>
          {[...Array(3)].map((_, i) => {
            return <img key={i} src={cloud} alt="Cloud" />;
          })}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
