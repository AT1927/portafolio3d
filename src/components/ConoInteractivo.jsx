import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

export default function ConoInteractivo() {
  const cubeRef = useRef();
  const [color, setColor] = useState("blue");

  // Animación del cubo (rotación continua)
  useFrame(() => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.01;
      cubeRef.current.rotation.y += 0.01;
    }
  });

  // Cambiar color al hacer clic
  const handleCubeClick = () => {
    const newColor = color === "blue" ? "red" : "blue";
    setColor(newColor);
  };

  return (
    <mesh
      ref={cubeRef}
      position={[3, 2, 2]} // 📌 Ajustamos la posición del cubo
      onClick={handleCubeClick}
      name="cubo"
    >
      <coneGeometry args={[1, 2, 4]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
