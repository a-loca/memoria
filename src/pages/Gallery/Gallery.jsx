import React from "react";
import styles from "./Gallery.module.css";
import hero from "../../assets/hero2.jpg";
import PlusMarker from "../../components/PlusMarker/PlusMarker";

function Gallery() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.imgWrapper}>
          <img src={hero} />
        </div>

        <h1>GALLERY</h1>
      </div>
      <div className={styles.galleryWrapper}>
        <div className={styles.plusMarkers}>
          <PlusMarker />
          <PlusMarker />
        </div>

        <div className={styles.gallery}>

        </div>
      </div>
    </div>
  );
}

export default Gallery;
