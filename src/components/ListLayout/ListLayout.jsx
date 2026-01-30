import React, { useState } from "react";
import styles from "./ListLayout.module.css";
import gsap from "gsap";
import { getFormattedDate } from "../../utils/utils";
import FloatingPicture from "../FloatingPicture/FloatingPicture";
import { NavLink } from "react-router-dom";

function ListLayout({ pictures }) {
  const [currentImage, setCurrentImage] = useState(null);

  const prepAnim = (e) => {
    const div = e.currentTarget;
    const rect = div.getBoundingClientRect();

    // -1 if mouse entering from the top, 1 if from the bottom
    // 1 if exiting from the bottom, -1 if from the top
    const direction = e.clientY < rect.top + rect.height / 2 ? -1 : 1;

    const highlight = div.querySelector(`.${styles.highlight}`);
    const info = [div.querySelector(`.${styles.date}`), div.querySelector(`.${styles.user}`)];

    return { highlight, info, direction };
  };

  const animateHighlightIn = (e) => {
    const { highlight, info, direction } = prepAnim(e);

    gsap.fromTo(highlight, { top: 100 * direction + "%" }, { top: 0, duration: 0.5 });
    gsap.fromTo(
      info,
      { opacity: 0, filter: "blur(0.25rem)" },
      { opacity: 1, filter: "blur(0rem)", duration: 0.3 }
    );
  };

  const animateHighlightOut = (e) => {
    const { highlight, info, direction } = prepAnim(e);

    gsap.to(highlight, {
      top: 100 * direction + "%",
      duration: 0.5,
    });
    gsap.fromTo(
      info,
      { opacity: 1, filter: "blur(0rem)" },
      { opacity: 0, filter: "blur(0.25rem)", duration: 0.3 }
    );
  };

  return (
    <>
      <FloatingPicture url={currentImage} />
      <div className={styles.list} onMouseLeave={() => setCurrentImage(null)}>
        {pictures.map((pic) => {
          return (
            pic.description && (
              <div
                key={pic.id}
                className={styles.row}
                onMouseEnter={(e) => {
                  setCurrentImage(pic.urls.small);
                  animateHighlightIn(e);
                }}
                onMouseLeave={(e) => animateHighlightOut(e)}
              >
                <div className={styles.highlight} />

                <div className={styles.date}>
                  <span>{getFormattedDate(pic.created_at)}</span>
                </div>

                <div className={styles.description}>
                  <NavLink to={"/gallery/" + pic.id}>
                    <span className={styles.description}>{pic.description}</span>
                  </NavLink>
                </div>

                <div className={styles.user}>
                  <span>by {pic.user.name}</span>
                </div>
              </div>
            )
          );
        })}
      </div>
    </>
  );
}

export default ListLayout;
