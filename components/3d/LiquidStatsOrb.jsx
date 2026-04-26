"use client"
import React, { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"

function Orb({ data }) {
  const mesh = useRef()
  const pulseRef = useRef(0)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    pulseRef.current = Math.sin(time * 0.5) * 0.1 + 1
    
    if (mesh.current) {
      mesh.current.rotation.y = time * 0.2
      mesh.current.rotation.z = time * 0.1
      // Dynamic distortion speed based on total solved
      mesh.current.distort = 0.4 + (Math.sin(time) * 0.1)
    }
  })

  // Colors based on LeetCode difficulty
  const colors = {
    easy: "#22C55E",
    medium: "#F59E0B",
    hard: "#EF4444",
  }

  return (
    <group>
      {/* Outer Glow */}
      <Sphere args={[2.2, 32, 32]}>
        <meshBasicMaterial 
          color="#3B82F6" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Main Liquid Orb */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={mesh}>
          <sphereGeometry args={[1.5, 128, 128]} />
          <MeshDistortMaterial
            color="#0ea5e9"
            speed={3}
            distort={0.4}
            radius={1}
            roughness={0.1}
            metalness={0.8}
            envMapIntensity={2}
          />
        </mesh>
      </Float>

      {/* Inner Swirling Difficulties (Metaball-ish) */}
      <Float speed={4} rotationIntensity={2} floatIntensity={1}>
        <Sphere args={[0.4, 32, 32]} position={[0.8, 0.5, 0]}>
          <meshStandardMaterial color={colors.easy} emissive={colors.easy} emissiveIntensity={2} />
        </Sphere>
      </Float>
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1.2}>
        <Sphere args={[0.35, 32, 32]} position={[-0.8, -0.3, 0.5]}>
          <meshStandardMaterial color={colors.medium} emissive={colors.medium} emissiveIntensity={2} />
        </Sphere>
      </Float>
      <Float speed={5} rotationIntensity={3} floatIntensity={0.8}>
        <Sphere args={[0.25, 32, 32]} position={[0, -0.8, -0.5]}>
          <meshStandardMaterial color={colors.hard} emissive={colors.hard} emissiveIntensity={2} />
        </Sphere>
      </Float>
    </group>
  )
}

export default function LiquidStatsOrb({ data }) {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#60A5FA" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Orb data={data} />
        
        <Environment preset="city" />
      </Canvas>
      
      {/* Absolute Overlays for text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="bg-black/20 backdrop-blur-md rounded-full p-8 border border-white/10 flex flex-col items-center justify-center scale-110 shadow-2xl">
          <span className="text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {data.totalSolved}
          </span>
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Solved</span>
        </div>
      </div>
    </div>
  )
}
