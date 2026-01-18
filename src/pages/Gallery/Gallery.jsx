import React from "react";
import styles from "./Gallery.module.css";
import hero from "../../assets/hero2.jpg";
import PlusMarker from "../../components/PlusMarker/PlusMarker";
import MasonryLayout from "../../components/MasonryLayout/MasonryLayout";
import useUnsplashPics from "../../hooks/useUnsplashPics";

function Gallery() {
  const {pictures} = useUnsplashPics()
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

        <div className={styles.grid}>
          <div className={styles.gallery}>
            <MasonryLayout pictures={pictures} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gallery;
