import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Mesh } from "three";
import { transformRange } from "../../utils/utils";
import { useThree, useFrame } from "@react-three/fiber";
import { lerp } from "../../utils/utils";
import { fragment, vertex } from "./shaders";
import { useTexture } from "@react-three/drei";

function ListImage({ url }) {
  const mesh = useRef();
  const { viewport } = useThree();
  const texture = useTexture(url);

  const uniforms = useRef({
    uTexture: { value: texture },
  });

  useEffect(() => {
    uniforms.current.uTexture.value = texture;
  }, [url]);

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  const meshPosition = useRef({
    meshX: 0,
    meshY: 0,
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
    const { meshX, meshY } = meshPosition.current;

    // Moving the mesh towards the mouse using linear interpolation
    meshPosition.current.meshX = lerp(meshX, x, 0.05);
    meshPosition.current.meshY = lerp(meshY, y, 0.05);

    // From pixel coordinates to cartesian coordinates
    const coordX = transformRange(
      meshPosition.current.meshX,
      [0, window.innerWidth],
      [(-1 * viewport.width) / 2, viewport.width / 2]
    );

    const coordY = transformRange(
      meshPosition.current.meshY,
      [0, window.innerHeight],
      [viewport.height / 2, (-1 * viewport.height) / 2]
    );

    gsap.set(mesh.current.position, { x: coordX, y: coordY });
  });

  return (
    <mesh ref={mesh}>
      <planeGeometry args={[2, 2, 15, 15]} />
      <shaderMaterial vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms.current} />
    </mesh>
  );
}

export default ListImage;
