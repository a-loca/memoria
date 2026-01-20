import React, { useRef, useState } from "react";
import styles from "./ListLayout.module.css";
import { getFormattedDate } from "../../utils/utils";
import gsap from "gsap";

function ListLayout({ pictures }) {
  const [hovered, setHovered] = useState(0);
  const highlight = useRef(null);

  const handleHover = (e, i) => {
    setHovered(i);
    const rect = e.target.getBoundingClientRect();
    const padding = 24;
    console.log(rect);
    gsap.to(highlight.current, { height: rect.height + padding, top: rect.top - padding / 2 });
  };

  return (
    <div className={styles.list}>
      <div ref={highlight} className={styles.highlight} />
      {pictures.map((pic, i) => {
        return (
          pic.description && (
            <div key={pic.id} className={styles.row} onMouseEnter={(e) => handleHover(e, i)}>
              {hovered === i && (
                <div className={styles.date}>
                  <span>{getFormattedDate(pic.created_at)}</span>
                </div>
              )}
              <div className={styles.description}>
                <a>
                  <span className={styles.description}>{pic.description}</span>
                </a>
              </div>
              {hovered === i && (
                <div className={styles.user}>
                  <span>by {pic.user.name}</span>
                </div>
              )}
            </div>
          )
        );
      })}
    </div>
  );
}

export default ListLayout;
