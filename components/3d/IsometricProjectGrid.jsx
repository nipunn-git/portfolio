"use client"
import React, { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { 
  Float, 
  MeshTransmissionMaterial, 
  PerspectiveCamera, 
  Text,
  useCursor,
  Environment,
  PresentationControls
} from "@react-three/drei"
import * as THREE from "three"

function ProjectBlock({ project, position, index }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      // Gentle floating animation
      mesh.current.position.y = position[1] + Math.sin(time + index) * 0.1
      // Smooth hover scale
      mesh.current.scale.lerp(new THREE.Vector3(hovered ? 1.1 : 1, hovered ? 1.1 : 1, hovered ? 1.1 : 1), 0.1)
    }
  })

  return (
    <group position={position}>
      <mesh 
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => window.open(project.github, "_blank")}
      >
        <boxGeometry args={[3, 1.5, 0.5]} />
        <meshPhysicalMaterial
          roughness={0.1}
          metalness={0.8}
          transmission={1}
          thickness={1}
          color={hovered ? "#60A5FA" : "white"}
        />
        
        {/* Project Title */}
        <Text
          position={[0, 0, 0.26]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {project.title.toUpperCase()}
        </Text>
      </mesh>
      
      {/* Glow behind */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3.2, 1.7]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={hovered ? 0.2 : 0} />
      </mesh>
    </group>
  )
}

export default function IsometricProjectGrid({ projects }) {
  const gridPositions = [
    [-4, 2, 0], [0, 2, 0], [4, 2, 0],
    [-4, -2, 0], [0, -2, 0]
  ]

  return (
    <div className="w-full h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], fov: 40 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0.3, -0.4, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
        >
          <group>
            {projects.map((project, i) => (
              <ProjectBlock 
                key={project.id} 
                project={project} 
                position={gridPositions[i] || [0,0,0]} 
                index={i}
              />
            ))}
          </group>
        </PresentationControls>

        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
