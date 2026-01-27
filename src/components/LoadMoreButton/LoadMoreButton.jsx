import React from "react";
import styles from "./LoadMoreButton.module.css";

function LoadMoreButton({ enabled, action }) {
  if (!enabled) return;
  return (
    <button onClick={action} className={styles.loadMore}>
      <span>+</span>
    </button>
  );
}

export default LoadMoreButton;
