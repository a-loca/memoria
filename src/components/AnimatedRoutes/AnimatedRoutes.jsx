import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Routes, matchPath } from "react-router-dom";
import styles from "./AnimatedRoutes.module.css";

function AnimatedRoutes({ children, exclude }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);

  const isInExcluded = (pathname) => {
    return exclude.some((toBeExcluded) => matchPath({ path: toBeExcluded }, pathname) !== null);
  };

  const prevPath = useRef("");
  const overlay = useRef();

  // Exit animation, triggered when the URL changes
  useGSAP(
    () => {
      // If not traveling to the same page
      if (location.pathname !== displayLocation.pathname) {
        // If i'm exiting an excluded path to go to an excluded path
        // don't animate
        if (isInExcluded(displayLocation.pathname) && isInExcluded(location.pathname)) {
          prevPath.current = displayLocation.pathname;
          setDisplayLocation(location);
          return;
        }

        // If the animation should run

        gsap.to(overlay.current, {
          opacity: 1,
          duration: 0.5,
          onComplete: () => setDisplayLocation(location),
        });
      }
    },
    { dependencies: [location.pathname] }
  );

  // Enter animation: triggered when the actual
  // location that the Routes display changes, after
  // having animated out the previous component
  useGSAP(
    () => {
      // if i'm coming from an excluded path and i'm going to an excluded path
      if (isInExcluded(prevPath.current) && isInExcluded(displayLocation.pathname)) {
        gsap.set(overlay.current, { opacity: 0 });
        return;
      }

      gsap.fromTo(overlay.current, { opacity: 1 }, { opacity: 0, duration: 0.5 });
    },
    { dependencies: [displayLocation.pathname] }
  );

  return (
    <div>
      <div className={styles.overlay} ref={overlay} />
      <Routes location={displayLocation}>{children}</Routes>
    </div>
  );
}

export default AnimatedRoutes;
