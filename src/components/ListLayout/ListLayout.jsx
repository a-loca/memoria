import React from "react";
import styles from "./ListLayout.module.css";
import { getFormattedDate } from "../../utils/utils";
import gsap from "gsap";

function ListLayout({ pictures }) {
  const animateHighlightIn = (e) => {
    const div = e.target;
    const rect = div.getBoundingClientRect();

    // -1 if mouse entering from the top, 1 if from the bottom
    const direction = e.clientY < rect.top + rect.height / 2 ? -1 : 1;

    const highlight = div.querySelector(`.${styles.highlight}`);
    const info = [div.querySelector(`.${styles.date}`), div.querySelector(`.${styles.user}`)];

    gsap.fromTo(highlight, { top: 100 * direction + "%" }, { top: 0, duration: 0.5 });
    gsap.fromTo(
      info,
      { opacity: 0, filter: "blur(0.25rem)" },
      { opacity: 1, filter: "blur(0rem)", duration: 0.3 }
    );
  };

  const animateHighlightOut = (e) => {
    const div = e.target;
    const rect = div.getBoundingClientRect();

    // 1 if exiting from the bottom, -1 if from the top
    const direction = e.clientY < rect.top + rect.height / 2 ? -1 : 1;

    const highlight = div.querySelector(`.${styles.highlight}`);
    const info = [div.querySelector(`.${styles.date}`), div.querySelector(`.${styles.user}`)];

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
    <div className={styles.list}>
      {pictures.map((pic) => {
        return (
          pic.description && (
            <div
              key={pic.id}
              className={styles.row}
              onMouseEnter={(e) => animateHighlightIn(e)}
              onMouseLeave={(e) => animateHighlightOut(e)}
            >
              <div className={styles.highlight} />

              <div className={styles.date}>
                <span>{getFormattedDate(pic.created_at)}</span>
              </div>

              <div className={styles.description}>
                <a>
                  <span className={styles.description}>{pic.description}</span>
                </a>
              </div>

              <div className={styles.user}>
                <span>by {pic.user.name}</span>
              </div>
            </div>
          )
        );
      })}
    </div>
  );
}

export default ListLayout;
