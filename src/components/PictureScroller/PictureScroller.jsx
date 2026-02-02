import React, { useEffect, useRef } from "react";
import styles from "./PictureScroller.module.css";
import example from "../../assets/gallery_hero.jpg";
import gsap from "gsap";

function PictureScroller() {
  const pics = useRef();
  const pic = useRef();
  const speed = 0.3;

  const handleScroll = (e) => {
    e.preventDefault();
    const rect = pics.current.getBoundingClientRect();
    const picRect = pic.current.getBoundingClientRect();

    // Offset will be positive when scrolling the list towards the top
    // Negative when scrolling the list towards the bottom
    let offset = -1 * e.deltaY * speed;
    console.log(offset);

    // Remaining scrollable space between the middle of the window
    // and the center of the first pic in the container
    const remainingTop = window.innerHeight / 2 - (rect.top + picRect.height / 2);

    // Scroll only as much needed to pin the top of the container
    // to the middle of the window, when scrolling up
    if (offset > remainingTop) offset = remainingTop;

    // Remaining scrollable space between the bottom of the container
    // and the middle of the window
    const remainingBottom = window.innerHeight / 2 - (rect.bottom - picRect.height / 2);

    // If the negative scroll requested is bigger (meaning that it's
    // a smaller negative number) than the remaining space, then
    // scroll down just for the remaining negative space
    if (offset < remainingBottom) offset = remainingBottom;

    gsap.set(pics.current, { y: `+=${offset}` });
  };

  useEffect(() => {
    document.addEventListener("wheel", handleScroll, { passive: false });

    return () => document.removeEventListener("wheel", handleScroll);
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pics} ref={pics}>
        {[...new Array(20)].map((_, i) => {
          return (
            <div ref={i === 0 ? pic : null} className={styles.picWrapper} key={i}>
              <img src={example} />
            </div>
          );
        })}
      </div>
      <div className={styles.frame} />
    </div>
  );
}

export default PictureScroller;
