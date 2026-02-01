import React from 'react'
import styles from "./ErrorScreen.module.css"
import cloud from "../../assets/cloud.svg"

function ErrorScreen() {
  return (
    <div className={styles.error}>
      <p>Something went wrong, try again.</p>
      <img src={cloud} alt="Cloud" />
    </div>
  );
}

export default ErrorScreen