import React, { useEffect, useRef } from "react";
import styles from "./FloatingPicture.module.css";
import gsap from "gsap";
import { lerp } from "../../utils/utils";

function FloatingPicture({ url }) {
  const container = useRef();
  const mouse = useRef({
    x: 0,
    y: 0,
  });
  const imgPosition = useRef({
    x: 0,
    y: 0,
  });

  // Need this to cancel animation frame once
  // component is unmounted
  const rafId = useRef();

  const handleMouseMove = (e) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
  };

  const animate = () => {
    const { x, y } = imgPosition.current;

    imgPosition.current = {
      x: lerp(x, mouse.current.x, 0.02),
      y: lerp(y, mouse.current.y, 0.02),
    };

    const rotationOffset = mouse.current.x - imgPosition.current.x;

    movePicture(imgPosition.current.x, imgPosition.current.y, rotationOffset);

    // Animation will be running at each frame
    rafId.current = requestAnimationFrame(animate);
  };

  const movePicture = (x, y, rotationOffset) => {
    if (!container) return;

    gsap.set(container.current, {
      x,
      y,
      xPercent: -50,
      yPercent: 5,
      rotate: 0.02 * rotationOffset + "deg",
    });
  };

  useEffect(() => {
    animate();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Cancel the animation frame when component is unmounted
      cancelAnimationFrame(rafId.current);
    };
  });

  return (
    <div ref={container} className={styles.floating}>
      <img src={url} />
    </div>
  );
}

export default FloatingPicture;
