import React from "react";
import styles from "./MasonryLayout.module.css";

function MasonryLayout({ pictures }) {
  return (
    <div className={styles.container}>
      <div className={styles.masonry}>
        {pictures.map((pic) => {
          return <img key={pic.id} src={pic.urls.small} />;
        })}
      </div>
    </div>
  );
}

export default MasonryLayout;
