import React, { useRef, useEffect, useState } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { TextureLoader, Sprite, SpriteMaterial, VideoTexture, Vector3 } from "three";

export default function ModeloPractica() {
    const gltf = useLoader(GLTFLoader, "/assets/model.glb");
    const [chairInitialPos, setChairInitialPos] = useState(null);
    const [targetChairPosition, setTargetChairPosition] = useState(null);
    const chairAudioRef = useRef(new Audio("/assets/chair-move.mp3")); // 🔹 Sonido de la silla
    const audioRef = useRef(new Audio("/assets/ambiente.mp3")); // 🔊 Sonido ambiente
    const noteTextures = [
        useLoader(TextureLoader, "/assets/note1.png"),
        useLoader(TextureLoader, "/assets/note2.png"),
        useLoader(TextureLoader, "/assets/note3.png"),
    ];
    const noteIntervalRef = useRef(null);

    // 🔹 Cargar texturas
    const texture = useLoader(TextureLoader, "/assets/baked.jpg");
    const screenTexture = useLoader(TextureLoader, "/assets/publicidad.jpg");
    
    const plantRef = useRef();
    const modelRef = useRef();
    const chairRef = useRef();
    const speakerRef = useRef();
    const notesRef = useRef([]);
    const screenRef = useRef()
  
    useEffect(() => {
      if (!gltf) return;
      chairRef.current = gltf.scene.getObjectByName("chair");
      plantRef.current = gltf.scene.getObjectByName("plant");
      speakerRef.current = gltf.scene.getObjectByName("speaker");

      // Configurar audio en loop
      audioRef.current.loop = true;
  
      // Buscar la pantalla y asignar la textura
      screenRef.current = gltf.scene.getObjectByName("desktop-plane-1");
  
      if (screenRef.current) {
        screenRef.current.material = screenRef.current.material.clone();
        screenRef.current.material.map = screenTexture;
        screenRef.current.material.needsUpdate = true;
      }

      if (chairRef.current) {
        setChairInitialPos(chairRef.current.position.clone());
      }

    }, [gltf, screenTexture]);
  
    // 🔹 Control de animaciones en cada frame
    useFrame(() => {
        if (chairRef.current && targetChairPosition) {
            chairRef.current.position.lerp(targetChairPosition, 0.1);
            if (chairRef.current.position.distanceTo(targetChairPosition) < 0.01) {
                setTargetChairPosition(null);
            }
        }

        // 📌 Animar las notas musicales
        notesRef.current.forEach((note, index) => {
            note.position.y += 0.02; // Subir
            note.material.opacity -= 0.005; // Desvanecerse

            if (note.material.opacity <= 0) {
                gltf.scene.remove(note);
                notesRef.current.splice(index, 1);
            }
        });
    });

  const handleChairClick = () => {
    if (chairRef.current) {
      setTargetChairPosition(new Vector3(
        chairRef.current.position.x + 1.5,
        chairRef.current.position.y,
        chairRef.current.position.z
      ));

      // 🔊 Reproducir sonido al mover la silla
      chairAudioRef.current.play().catch((error) => console.error("❌ Error al reproducir audio:", error));

    }
  };

  const handleSpeakerClick = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      console.log("🎵 Música activada");
      startNotes();
    } else {
      audioRef.current.pause();
      console.log("🔇 Música pausada");
      stopNotes();
    }
  };

    // 🎶 Función para crear notas musicales que flotan
    const startNotes = () => {
        stopNotes(); // Limpiar intervalos previos
        noteIntervalRef.current = setInterval(() => {
            if (!speakerRef.current) return;

            const texture = noteTextures[Math.floor(Math.random() * 3)];
            const material = new SpriteMaterial({ map: texture, transparent: true, opacity: 1 });
            const note = new Sprite(material);

            const speakerPos = speakerRef.current.position.clone();
            note.position.set(speakerPos.x, speakerPos.y + 0.2, speakerPos.z);
            note.scale.set(0.3, 0.3, 0.3);

            gltf.scene.add(note);
            notesRef.current.push(note);
        }, 500);
    };

    const stopNotes = () => {
        clearInterval(noteIntervalRef.current);
    };

    const handlePlantClick = () => {
        if (!chairRef.current || !chairInitialPos) return;

        console.log("🌿 Click en planta: restaurando silla");
        setTargetChairPosition(chairInitialPos.clone());
    };

  return (
    <primitive 
      object={gltf.scene} 
      scale={1} 
      position={[0, -1, 0]} 
      onPointerDown={(event) => {
        if (event.object.name === "chair") handleChairClick();
        if (event.object.name === "speaker") handleSpeakerClick();
        if (event.object.name === "plant") handlePlantClick();
      }} 
    />
  );
}