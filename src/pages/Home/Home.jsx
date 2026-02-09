import React from "react";
import styles from "./Home.module.css";
import heroImg from "../../assets/img/home_hero.png";

function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.maskedTitle}>MEMORIA</h1>
      <div className={styles.imgWrapper}>
        <img src={heroImg} alt="Nostalgic image of a woman looking at a cloudy sunset" />
      </div>
    </div>
  );
}

export default Home;
