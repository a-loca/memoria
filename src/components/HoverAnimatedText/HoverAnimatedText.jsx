import React from "react";
import styles from "./HoverAnimatedText.module.css";

function HoverAnimatedText({ text }) {
  return (
    <div className={styles.wrapper}>
      <span>{text}</span>
      <span>{text}</span>
    </div>
  );
}

export default HoverAnimatedText;
