import React, { useEffect, useRef } from "react";
import styles from "./PictureScroller.module.css";
import gsap from "gsap";
import { lerp } from "../../utils/utils";

function PictureScroller({ pictures, currentPic, onSelectPic }) {
  // Ref to container that needs to be moved
  const container = useRef();

  // The wrappers of the pictures
  const pics = useRef([]);

  // Height of one pic
  const picHeight = useRef();

  // Pixel space between centers of sequential pics
  const picStride = useRef();

  // Currently selected picture ID
  const currentId = useRef(currentPic.id);

  // Scroll speed
  const speed = 0.5;

  // The Y coordinate the pics container needs to be moved to
  // based on the scroll the user made
  const targetY = useRef(0);

  // The actual Y value of the container used to animate
  // with linear interpolation with respect to the target
  // Y goal
  const currentY = useRef(0);

  // ID of the current animation loop
  const rafId = useRef();

  const hasSettled = useRef(true);

  const handleScroll = (e) => {
    e.preventDefault();

    hasSettled.current = false;

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
    // Gradually move the current Y value of the container
    // towards the target Y coordinate it needs to reach
    currentY.current = lerp(currentY.current, targetY.current, 0.05);

    // Animate position of the container
    gsap.set(container.current, { y: currentY.current });

    if (Math.abs(currentY.current - targetY.current) < 0.1 && !hasSettled.current) {
      hasSettled.current = true;
      changeCurrentPic();
    }

    rafId.current = requestAnimationFrame(animate);
  };

  const changeCurrentPic = () => {
    console.log("changeCurrentPic");
    const rect = container.current.getBoundingClientRect();
    const fromTop = rect.top - window.innerHeight / 2;
    const index = -Math.trunc(fromTop / picStride.current);

    const newPic = pictures[index];

    if (newPic.id != currentId.current) {
      currentId.current = newPic.id;
      onSelectPic(newPic.id);
    }
  };

  useEffect(() => {
    document.addEventListener("wheel", handleScroll, { passive: false });

    // Get pic height and margin between pics
    const first = pics.current[0].getBoundingClientRect();
    const second = pics.current[1].getBoundingClientRect();

    picHeight.current = first.height;
    picStride.current = second.top - first.top;

    // Position container so that the selected picture is centered
    const index = pictures.findIndex((p) => currentPic.id === p.id);
    targetY.current = -index * picStride.current + window.innerHeight / 2 - picHeight.current / 2;
    currentY.current = targetY.current;

    // Start the smooth animation loop
    animate();

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("wheel", handleScroll);
    };
  }, []);

  const handleClick = (index) => {
    const picRect = pics.current[index].getBoundingClientRect();
    const center = picRect.top + picRect.height / 2;

    targetY.current = targetY.current + (window.innerHeight / 2 - center);

    const pic = pictures[index];

    onSelectPic(pic.id);
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
              data-selected={pic.id === currentPic.id}
            >
              <img src={pic.urls.thumb} alt={pic.description} />
            </div>
          );
        })}
      </div>
      <div className={styles.frame}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default PictureScroller;
