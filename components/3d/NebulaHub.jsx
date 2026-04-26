"use client"
import React, { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { 
  PerspectiveCamera, 
  Environment, 
  Float,
  Text,
  Stars,
  useCursor,
  Billboard,
  MeshDistortMaterial
} from "@react-three/drei"
import * as THREE from "three"

function StarEntity({ repo, position, active, setActive, index }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  
  const isActive = active === index

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      // Gentle floating
      mesh.current.position.y += Math.sin(time + index) * 0.002
      
      // Scale based on distance/active
      const targetScale = isActive ? 2.5 : (hovered ? 1.5 : 0.8)
      mesh.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group position={position}>
      <mesh 
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setActive(index)}
      >
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial 
          color={isActive ? "#60A5FA" : (hovered ? "#93C5FD" : "#3B82F6")} 
          emissive={isActive ? "#60A5FA" : (hovered ? "#3B82F6" : "#1E3A8A")}
          emissiveIntensity={isActive ? 8 : (hovered ? 4 : 1)}
          transparent
          opacity={isActive || hovered ? 1 : 0.6}
        />
        
        {/* Halo */}
        <mesh scale={1.2}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial 
            color={isActive ? "#60A5FA" : "#3B82F6"} 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      </mesh>

      {/* Label - Positioned to the side to avoid covering the star */}
      <Billboard position={[0, -1.2, 0]}>
        <Text
          fontSize={isActive ? 0.35 : 0.18}
          color="white"
          maxWidth={2}
          textAlign="center"
          anchorX="center"
          anchorY="top"
          opacity={isActive ? 1 : (hovered ? 0.8 : 0.4)}
        >
          {repo.name.toUpperCase()}
        </Text>
      </Billboard>
    </group>
  )
}

export default function NebulaHub({ repos, active, setActive }) {
  // Spiral Galaxy distribution
  const starPositions = useMemo(() => {
    if (!repos || repos.length === 0) return []
    return repos.map((_, i) => {
      const angle = (i / repos.length) * Math.PI * 4 // Double spiral
      const radius = 3 + (i * 2)
      return [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius
      ]
    })
  }, [repos])

  return (
    <div className="w-full h-[600px] relative bg-[#030712] rounded-[3.5rem] overflow-hidden border border-white/05 shadow-2xl">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 10, 20]} fov={45} />
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={2.5} color="#60A5FA" />
        
        <group>
          {repos && repos.map((repo, i) => (
            <StarEntity 
              key={repo.id} 
              repo={repo} 
              position={starPositions[i] || [0,0,0]} 
              active={active} 
              setActive={setActive} 
              index={i} 
            />
          ))}
        </group>

        {/* Ultra-Dense Starfield for background depth */}
        <Stars radius={150} depth={80} count={15000} factor={6} saturation={0} fade speed={1.5} />
        
        {/* Moving Nebula effect (distorted planes) */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
           <mesh position={[0, -10, -20]} rotation={[Math.PI/2, 0, 0]}>
              <planeGeometry args={[100, 100]} />
              <meshBasicMaterial color="#1E3A8A" transparent opacity={0.03} wireframe />
           </mesh>
        </Float>

        <Environment preset="night" />
        
        <CameraController activeIndex={active} positions={starPositions} />
      </Canvas>
      
      {/* HUD Info */}
      <div className="absolute top-8 left-8 p-4 bg-white/03 backdrop-blur-md border border-white/05 rounded-xl pointer-events-none">
         <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Nebula_Index::Active</span>
         </div>
      </div>
    </div>
  )
}

function CameraController({ activeIndex, positions }) {
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (positions && positions.length > 0 && activeIndex !== undefined && positions[activeIndex]) {
      const target = new THREE.Vector3(...positions[activeIndex])
      
      // Slow cinematic orbit around the active repo, keeping a wide enough distance to see others
      const orbitRadius = 14; 
      const orbitX = Math.sin(time * 0.15) * orbitRadius;
      const orbitZ = Math.cos(time * 0.15) * orbitRadius;
      
      const cameraTarget = target.clone().add(new THREE.Vector3(orbitX, 4, orbitZ))
      state.camera.position.lerp(cameraTarget, 0.05)
      state.camera.lookAt(target.clone().add(new THREE.Vector3(0, 0.5, 0)))
    } else {
      // Default orbiting overview if no active or empty
      state.camera.position.x = Math.sin(time * 0.1) * 30
      state.camera.position.z = Math.cos(time * 0.1) * 30
      state.camera.lookAt(0, 0, 0)
    }
  })
  return null
}
