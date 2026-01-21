import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Mesh } from "three";
import { transformRange } from "../../utils/utils";
import { useThree, useFrame } from "@react-three/fiber";
import { lerp } from "../../utils/utils";

function ListImage() {
  const mesh = useRef();
  const { viewport } = useThree();

  const mouse = useRef({
    x: 0,
    y: 0,
  });
  
  const smoothMouse = useRef({
    smoothX: 0,
    smoothY: 0,
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    const { x, y } = mouse.current;
    const { smoothX, smoothY } = smoothMouse.current;

    const newX = lerp(smoothX, x, 0.05);
    const newY = lerp(smoothY, y, 0.05);

    smoothMouse.current = {
      smoothX: newX,
      smoothY: newY,
    };

    const coordX = transformRange(
      newX,
      [0, window.innerWidth],
      [(-1 * viewport.width) / 2, viewport.width / 2]
    );

    const coordY = transformRange(
      newY,
      [0, window.innerHeight],
      [viewport.height / 2, (-1 * viewport.height) / 2]
    );

    gsap.set(mesh.current.position, { x: coordX });
    gsap.set(mesh.current.position, { y: coordY });
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2, 15, 15]} />
      <meshBasicMaterial color={"red"} />
    </mesh>
  );
}

export default ListImage;
