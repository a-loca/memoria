import React from "react";
import styles from "./MasonryLayout.module.css";
import Picture from "../Picture/Picture";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

function MasonryLayout({ pictures }) {
  return (
    <div className={styles.container}>
      {/* 
       <div className={styles.masonry}>
        {pictures.map((pic) => {

          return (
            <div key={pic.id} className={styles.imgWrapper}>
              <Picture src={pic.urls.small} blurhash={pic.blurhash} alt={pic.description}/>
            </div>
          );
        })}
      </div>
       */}
      <ResponsiveMasonry
        className={styles.masonry}
        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3, 1200: 4 }}
        // gutterBreakPoints={{ 350: "12px", 750: "16px", 900: "2em" }}
      >
        <Masonry sequential={true}>
          {pictures.map((pic) => {
            return (
              <div key={pic.id} className={styles.imgWrapper}>
                <Picture src={pic.urls.small} blurhash={pic.blurhash} alt={pic.description} />
              </div>
            );
          })}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default MasonryLayout;
