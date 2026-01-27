import React, { useState } from "react";
import styles from "./Gallery.module.css";
import hero from "../../assets/hero2.jpg";
import PlusMarker from "../../components/PlusMarker/PlusMarker";
import MasonryLayout from "../../components/MasonryLayout/MasonryLayout";
import ListLayout from "../../components/ListLayout/ListLayout";
import useUnsplashPics from "../../hooks/useUnsplashPics";
import ViewModeSwitcher from "../../components/ViewModeSwitcher/ViewModeSwitcher";
import ScrollToTopButton from "../../components/ScrollToTopButton/ScrollToTopButton";
import LoadMoreButton from "../../components/LoadMoreButton/LoadMoreButton";

function Gallery() {
  const { pictures, loadNext, canDownloadMore } = useUnsplashPics();

  const modes = [
    { type: "Grid", id: 0, element: <MasonryLayout pictures={pictures} /> },
    { type: "List", id: 1, element: <ListLayout pictures={pictures} /> },
  ];
  const [currentMode, setCurrentMode] = useState(modes[0].id);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.imgWrapper}>
          <img src={hero} />
        </div>

        <h1>GALLERY</h1>
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
      <div style={{ height: "200vh" }} />
    </div>
  );
}

export default Gallery;
