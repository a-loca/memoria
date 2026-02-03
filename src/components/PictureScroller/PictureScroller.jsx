import React, { useEffect, useRef } from "react";
import styles from "./PictureScroller.module.css";
import gsap from "gsap";
import { lerp } from "../../utils/utils";

function PictureScroller({ pictures }) {
  const picsRef = useRef();
  const picRef = useRef();

  const speed = 0.5;

  const targetY = useRef(0);
  const currentY = useRef(0);

  const rafId = useRef();

  const handleScroll = (e) => {
    e.preventDefault();
    const rect = picsRef.current.getBoundingClientRect();
    const picRect = picRef.current.getBoundingClientRect();
    const centerWindow = window.innerHeight / 2;

    // The "amount of scroll" requested
    let offset = -1 * e.deltaY * speed;

    // The Y coordinate the container will be after the scroll
    let nextY = targetY.current + offset;

    // How much space left until the first pic of the list reaches the
    // middle of the window (it's a positive number)
    const remainingTop = centerWindow - (rect.top + picRect.height / 2);

    // How much space left until the last pic of the list reaches
    // the middle of the window (it's a negative number)
    const remainingBottom = centerWindow - (rect.bottom - picRect.height / 2);

    // Can't move the container down past the sum of the current position and the space
    // left until the upper bound
    nextY = Math.min(nextY, remainingTop + currentY.current);

    // Can't move the container up past the sum of the current position and the
    // space left until the lower bound
    nextY = Math.max(nextY, remainingBottom + currentY.current);

    targetY.current = nextY;
  };

  const animate = () => {
    currentY.current = lerp(currentY.current, targetY.current, 0.02);

    gsap.set(picsRef.current, { y: currentY.current });

    rafId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
    document.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.pics} ref={picsRef}>
        {pictures.map((pic, i) => {
          return (
            <div ref={i === 0 ? picRef : null} className={styles.picWrapper} key={pic.id}>
              <img src={pic.urls.thumb} alt={pic.description} />
            </div>
          );
        })}
      </div>
      <div className={styles.frame} />
    </div>
  );
}

export default PictureScroller;
