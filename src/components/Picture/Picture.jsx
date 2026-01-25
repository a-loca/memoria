import React, { useRef } from "react";
import { Blurhash } from "react-blurhash";
import gsap from "gsap";
import styles from "./Picture.module.css";

function Picture({ src, blurhash, alt }) {
  const hashblur = useRef();
  const img = useRef();

  const handleLoad = () => {
    gsap.fromTo(hashblur.current, { opacity: 1 }, { opacity: 0, duration: 1 });
    gsap.fromTo(
      img.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
      }
    );
  };

  return (
    <div className={styles.container}>
      <div ref={hashblur} className={styles.blurWrapper}>
        <Blurhash
          hash={blurhash}
          height={"100%"}
          width={"100%"}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </div>

      <img ref={img} alt={alt} style={{ opacity: 0 }} src={src} onLoad={handleLoad} />
    </div>
  );
}

export default Picture;
