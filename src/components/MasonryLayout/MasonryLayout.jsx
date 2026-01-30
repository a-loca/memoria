import React from "react";
import styles from "./MasonryLayout.module.css";
import Picture from "../Picture/Picture";
import { BalancedMasonryGrid as MasonryGrid, Frame } from "@masonry-grid/react";
import { NavLink } from "react-router-dom";

function MasonryLayout({ pictures }) {
  return (
    <div className={styles.container}>
      <MasonryGrid className={styles.masonry} gap={16} frameWidth={500}>
        {pictures.map((pic) => (
          <Frame key={pic.id} className={styles.frame} width={pic.width} height={pic.height}>
            <NavLink to={"/gallery/" + pic.id}>
              <div className={styles.imgWrapper}>
                <Picture src={pic.urls.small} blurhash={pic.blurhash} alt={pic.description} />
              </div>
            </NavLink>
          </Frame>
        ))}
      </MasonryGrid>
    </div>
  );
}

export default MasonryLayout;
