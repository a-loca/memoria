import React, {useRef} from "react";
import styles from "./GalleryHero.module.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import hero from "../../assets/img/gallery_hero.jpg";

function GalleryHero() {
  const heroContainer = useRef();
  const heroTitle = useRef();
  const heroImgContainer = useRef();
  const heroImg = useRef();

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroContainer.current,
        scrub: true,
        start: "top top",
        end: "bottom top",
      },
    });

    tl.to(
      heroTitle.current,
      {
        y: -100,
        filter: "blur(1em)",
        opacity: 0,
        scale: 1.1,
      },
      0
    );

    tl.to(
      heroImgContainer.current,
      {
        scale: 1.2,
        opacity: 0,
        filter: "blur(0.5em)",
      },
      0
    );

    tl.to(
      heroImg.current,
      {
        scale: 1.3,
      },
      0
    );
  });
  return (
    <div className={styles.hero} ref={heroContainer}>
      <div className={styles.title} ref={heroTitle}>
        <h1>Gallery</h1>
      </div>
      <div className={styles.heroImg} ref={heroImgContainer}>
        <img src={hero} ref={heroImg} />
      </div>
      <div className={styles.captions}>
        <p>Some moments keep floating</p>
        <p>They linger</p>
        <p>Clouds above, soft and bright</p>
        <p className={styles.mobileCaption}>Memories that shine, warm clouds in the sky above</p>
      </div>
    </div>
  );
}

export default GalleryHero;
