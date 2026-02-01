import React from "react";
import styles from "./LoadingScreen.module.css";
import cloud from "../../assets/cloud.svg";
import Spinner from "../Spinner/Spinner";

function LoadingScreen() {
  return (
    <div className={styles.loading}>
      <div className={styles.spinner}>
        <Spinner />
      </div>
      <img src={cloud} />
    </div>
  );
}

export default LoadingScreen;
