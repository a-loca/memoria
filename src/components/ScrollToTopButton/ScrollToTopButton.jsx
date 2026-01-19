import React from "react";
import styles from "./ScrollToTopButton.module.css";

function ScrollToTopButton() {
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
      <span>Back to top</span>
    </button>
  );
}

export default ScrollToTopButton;
