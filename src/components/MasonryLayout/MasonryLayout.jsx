import React from "react";
import styles from "./MasonryLayout.module.css";
import Picture from "../Picture/Picture";

function MasonryLayout({ pictures }) {
  return (
    <div className={styles.container}>
      <div className={styles.masonry}>
        {pictures.map((pic) => {

          return (
            <div key={pic.id} className={styles.imgWrapper}>
              <Picture src={pic.urls.small} blurhash={pic.blurhash} alt={pic.description}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MasonryLayout;
