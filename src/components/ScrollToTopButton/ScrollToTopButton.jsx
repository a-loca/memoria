import React from "react";
import styles from "./ScrollToTopButton.module.css";

function ScrollToTopButton() {
  return (
    <button className={styles.scrollToTopBtn} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <div>
        <span>↑ Back</span>
        <span>to top</span>
      </div>
    </button>
  );
}

export default ScrollToTopButton;
