import React, { useEffect, useRef, useState } from "react";
import styles from "./PictureScroller.module.css";
import gsap from "gsap";
import { lerp } from "../../utils/utils";

function PictureScroller({ pictures }) {
  const [currentPic, setCurrentPic] = useState();

  const container = useRef();
  const pics = useRef([]);
  const picHeight = useRef();
  const picStride = useRef();

  const speed = 0.5;

  const targetY = useRef(0);
  const currentY = useRef(0);

  const rafId = useRef();

  const handleScroll = (e) => {
    e.preventDefault();

    const rect = container.current.getBoundingClientRect();
    const centerWindow = window.innerHeight / 2;

    // The "amount of scroll" requested
    let offset = -1 * e.deltaY * speed;

    // The Y coordinate the container will be after the scroll
    let nextY = targetY.current + offset;

    // How much space left until the first pic of the list reaches the
    // middle of the window (it's a positive number)
    const remainingTop = centerWindow - (rect.top + picHeight.current / 2);

    // How much space left until the last pic of the list reaches
    // the middle of the window (it's a negative number)
    const remainingBottom = centerWindow - (rect.bottom - picHeight.current / 2);

    // Can't move the container down past the sum of the current position and the space
    // left until the upper bound
    nextY = Math.min(nextY, remainingTop + currentY.current);

    // Can't move the container up past the sum of the current position and the
    // space left until the lower bound
    nextY = Math.max(nextY, remainingBottom + currentY.current);

    targetY.current = nextY;
  };

  const animate = () => {
    currentY.current = lerp(currentY.current, targetY.current, 0.05);

    gsap.set(container.current, { y: currentY.current });

    changeCurrentPic();

    rafId.current = requestAnimationFrame(animate);
  };

  const changeCurrentPic = () => {
    const rect = container.current.getBoundingClientRect();
    const fromTop = rect.top - window.innerHeight / 2;
    setCurrentPic(-Math.trunc(fromTop / picStride.current));
  };

  useEffect(() => {
    animate();
    document.addEventListener("wheel", handleScroll, { passive: false });

    // Get pic height and margin between pics
    const first = pics.current[0].getBoundingClientRect();
    const second = pics.current[1].getBoundingClientRect();
    picHeight.current = first.height;
    picStride.current = second.top - first.top;

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const handleClick = (i) => {
    const picRect = pics.current[i].getBoundingClientRect();
    const center = picRect.top + picRect.height / 2;
    const containerRect = container.current.getBoundingClientRect();

    targetY.current = targetY.current + (window.innerHeight / 2 - center);

    setCurrentPic(i);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.pics} ref={container}>
        {pictures.map((pic, i) => {
          return (
            <div
              ref={(el) => (pics.current[i] = el)}
              className={styles.picWrapper}
              key={pic.id}
              onClick={() => handleClick(i)}
              data-selected={i === currentPic}
            >
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
