import React, { useEffect } from "react";
import styles from "./Home.module.css";
import heroImg from "../../assets/hero_cropped.png";

function Home() {

  return (
    <div className={styles.container}>
      <h1 className={styles.maskedTitle}>MEMORIA</h1>
      <div className={styles.imgWrapper}>
        <img src={heroImg} />
      </div>
    </div>
  );
}

export default Home;
