import React from "react";
import styles from "./Footer.module.css";
import PlusMarker from "../PlusMarker/PlusMarker";

function Footer() {
  return (
    <footer>
      <div className={styles.container}>
        <div className={styles.author}>
            <PlusMarker/>
            <p>Website by Alessandro Locatelli</p>
            <PlusMarker/>
        </div>
        <p className={styles.name}>Memoria</p>
      </div>
    </footer>
  );
}

export default Footer;
