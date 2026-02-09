import React from 'react'
import styles from "./About.module.css"
import Footer from '../../components/Footer/Footer';
import img1 from "../../assets/img/about_1.jpg";
import img2 from "../../assets/img/about_2.jpg";
import img3 from "../../assets/img/about_3.jpg";
import img4 from "../../assets/img/about_4.jpg";

function About() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>An experiment made with React and GSAP</h1>
        <div className={styles.captions}>
          <p>Designed in Figma</p>
          <p>Smooth scrolling with Lenis</p>
          <p>Memories from Unsplash API</p>
          <p>Hero images from Pinterest</p>
        </div>
      </div>
      <div className={styles.grid}>
        <img src={img3} />
        <img src={img4} />
        <img src={img2} />
        <img src={img1} />
      </div>

      <Footer/>
    </div>
  );
}

export default About