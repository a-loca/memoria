import React from "react";
import styles from "./MasonryLayout.module.css";

function MasonryLayout({ pictures }) {
  return (
    <div className={styles.masonry}>
      {pictures.map((pic, i) => {
        return <img key={pic.id} src={pic.urls.small} />;
      })}
    </div>
  );
}

export default MasonryLayout;
