import React, { useEffect, useRef, useState } from "react";
import styles from "./FloatingPicture.module.css";
import gsap from "gsap";
import { lerp } from "../../utils/utils";

function FloatingPicture({ url }) {
  const container = useRef();
  const [displayedUrl, setDisplayedUrl] = useState();

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
    // Prevent rotation to take place for imperceptible values
    const clampedRotation = Math.abs(rotationOffset) < 0.01 ? 0 : rotationOffset;

    movePicture(imgPosition.current.x, imgPosition.current.y, clampedRotation);

    // Animation will be running at each frame
    rafId.current = requestAnimationFrame(animate);
  };

  const movePicture = (x, y, rotationOffset) => {
    if (!container) return;

    gsap.set(container.current, {
      x,
      y: y + 15,
      xPercent: -50,
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
  }, []);

  useEffect(() => {
    if (url) {
      setDisplayedUrl(url);
      gsap.to(container.current, { opacity: 1, filter: "blur(0px)", duration: 0.6 });
    } else {
      gsap.to(container.current, { opacity: 0, filter: "blur(1em)", duration: 0.6 });
    }
  }, [url]);

  return (
    <div ref={container} className={styles.floating}>
      <img src={displayedUrl} />
    </div>
  );
}

export default FloatingPicture;
