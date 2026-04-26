"use client"
import React, { useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { 
  Float, 
  MeshTransmissionMaterial, 
  PerspectiveCamera, 
  Text,
  useCursor,
  Environment,
  ContactShadows,
  Html
} from "@react-three/drei"
import * as THREE from "three"

function ProjectCard({ project, position, index, active, setActive }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  
  const isActive = active === index

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      // Cinematic tilt
      const x = (state.mouse.x * 0.25)
      const y = (state.mouse.y * 0.25)
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, y + (isActive ? 0.1 : 0), 0.1)
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, x + (isActive ? 0.3 : 0), 0.1)
      
      mesh.current.position.y = position[1] + Math.sin(time + index) * 0.15
      
      const s = isActive ? 1.3 : (hovered ? 1.1 : 1)
      mesh.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1)
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    if (isActive) {
      window.open(project.github, "_blank")
    } else {
      setActive(index)
    }
  }

  return (
    <group position={position}>
      <mesh 
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <boxGeometry args={[4.5, 2.8, 0.05]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.8}
          chromaticAberration={0.1}
          anisotropy={0.5}
          distortion={0}
          transmission={1}
          color={hovered || isActive ? "#93C5FD" : "#ffffff"}
          roughness={0}
          metalness={1}
          ior={1.5}
        />

        {/* Content - Only rendered once, clean typography */}
        <Text
          position={[0, 0.4, 0.03]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={3.5}
          textAlign="center"
        >
          {project.title.toUpperCase()}
        </Text>
        
        <Text
          position={[0, -0.4, 0.03]}
          fontSize={0.12}
          color="white"
          opacity={0.6}
          maxWidth={3.5}
          textAlign="center"
          anchorX="center"
          anchorY="top"
        >
          {project.tech.join(" // ")}
        </Text>
        
        {isActive && (
           <Text
             position={[0, -1, 0.03]}
             fontSize={0.1}
             color="#60A5FA"
             anchorX="center"
             anchorY="top"
           >
             CLICK TO OPEN SOURCE ↗
           </Text>
        )}
      </mesh>
    </group>
  )
}

export default function ProjectDeck({ projects, active, setActive }) {
  const positions = [
    [-5, 2, 0], [0, 2, 0], [5, 2, 0],
    [-2.5, -1.5, 0], [2.5, -1.5, 0]
  ]

  return (
    <div className="w-full h-[700px] relative">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={35} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#60A5FA" />
        
        <group>
          {projects.map((project, i) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              position={positions[i] || [0,0,0]} 
              index={i} 
              active={active} 
              setActive={setActive} 
            />
          ))}
        </group>
        
        <Environment preset="city" />
        <ContactShadows position={[0, -6, 0]} opacity={0.3} scale={30} blur={2.5} far={8} />
      </Canvas>
    </div>
  )
}
