import { Canvas } from "@react-three/fiber";
import React from "react";
import styles from "./Scene.module.css";

function Scene({ model }) {
  return (
    <div className={styles.wrapper}>
      <Canvas style={{pointerEvents: "none"}}>{model}</Canvas>
    </div>
  );
}

export default Scene;
