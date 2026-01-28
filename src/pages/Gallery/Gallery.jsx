import React, { useRef, useState } from "react";
import styles from "./Gallery.module.css";
// import hero from "../../assets/hero2.jpg";
import hero from "../../assets/gallery_hero.jpg";
import PlusMarker from "../../components/PlusMarker/PlusMarker";
import MasonryLayout from "../../components/MasonryLayout/MasonryLayout";
import ListLayout from "../../components/ListLayout/ListLayout";
import useUnsplashPics from "../../hooks/useUnsplashPics";
import ViewModeSwitcher from "../../components/ViewModeSwitcher/ViewModeSwitcher";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Gallery() {
  const { pictures, loadNext, canDownloadMore } = useUnsplashPics();

  const heroContainer = useRef();
  const heroTitle = useRef();
  const heroImgContainer = useRef();
  const heroImg = useRef();

  const modes = [
    { type: "Grid", id: 0, element: <MasonryLayout pictures={pictures} /> },
    { type: "List", id: 1, element: <ListLayout pictures={pictures} /> },
  ];
  const [currentMode, setCurrentMode] = useState(modes[0].id);

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
    <div className={styles.container}>
      <div className={styles.hero} ref={heroContainer}>
        <div className={styles.title} ref={heroTitle}>
          <h1>Gallery</h1>
        </div>
        <div className={styles.heroImg} ref={heroImgContainer}>
          <img src={hero} ref={heroImg} />
        </div>
        <div className={styles.text}>
          <p>Some moments keep floating</p>
          <p>They linger</p>
          <p>Clouds above, soft and bright</p>
        </div>
      </div>

      <div className={styles.wrapper}>
        <div className={styles.plusMarkers}>
          <PlusMarker />
          <PlusMarker />
        </div>

        <div className={styles.content}>
          {modes.find((mode) => mode.id === currentMode).element}
        </div>

        <LoadMoreButton enabled={canDownloadMore} action={loadNext} />

        <div className={styles.actions}>
          <div className={styles.switcher}>
            <ViewModeSwitcher
              modes={modes}
              currentMode={currentMode}
              setCurrentMode={setCurrentMode}
            />
          </div>

          <ScrollToTopButton />
        </div>
      </div>
      {/* <div style={{ height: "200vh" }} /> */}
    </div>
  );
}

export default Gallery;
