import React, { useEffect, useRef } from "react";
import styles from "./NotFound.module.css";
import cloud from "../../assets/cloud.svg";
import gsap from "gsap";
import { lerp } from "../../utils/utils";

function NotFound() {
  const plane1 = useRef();
  const plane2 = useRef();
  const plane3 = useRef();

  const speedX = 0.004;
  const speedY = 0.002;

  let xForce = 0;
  let yForce = 0;

  let rafId = null;

  const handleMouseMove = (e) => {
    xForce += e.movementX * speedX;
    yForce += e.movementY * speedY;
  };

  const animate = () => {
    xForce = lerp(xForce, 0, 0.02);
    yForce = lerp(yForce, 0, 0.02);

    gsap.set(plane1.current, { x: `+=${xForce}`, y: `+=${yForce}` });
    gsap.set(plane2.current, { x: `+=${xForce * 0.5}`, y: `+=${yForce * 0.5}` });
    gsap.set(plane3.current, { x: `+=${xForce * 0.25}`, y: `+=${yForce * 0.25}` });

    rafId = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>404</h1>
        <p>Memory not found</p>
      </div>
      <div className={styles.planes}>
        <div className={styles.plane} ref={plane1}>
          <img src={cloud} alt="Cloud" />
          <img src={cloud} alt="Cloud" />
        </div>
        <div className={styles.plane} ref={plane2}>
          <img src={cloud} alt="Cloud" />
          <img src={cloud} alt="Cloud" />
        </div>
        <div className={styles.plane} ref={plane3}>
          <img src={cloud} alt="Cloud" />
          <img src={cloud} alt="Cloud" />
          <img src={cloud} alt="Cloud" />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
