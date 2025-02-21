import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import ModeloPractica from "../components/ModeloPractica";
import ConoInteractivo from "../components/ConoInteractivo";

function Ejercicio1() {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Escenario 3D */}
      <Canvas
        className="position-absolute w-100 h-100"
        style={{ position: "fixed", width: "100vw", height: "100vh" }}
        camera={{ position: [10, 5, 10], fov: 40 }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 20, 5]} intensity={1.2} />
        <Environment preset="city" />
        
        <ModeloPractica />
        <ConoInteractivo />

        <OrbitControls enableRotate={true} />
      </Canvas>
    </div>
  );
}
export default Ejercicio1;     