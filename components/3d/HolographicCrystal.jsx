"use client"
import React, { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { 
  Float, 
  MeshTransmissionMaterial, 
  PerspectiveCamera, 
  Environment,
  Text,
  ContactShadows,
  useCursor
} from "@react-three/drei"
import * as THREE from "three"

function Crystal({ active, setActive, data }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, active ? time * 1.5 : time * 0.3, 0.05)
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, active ? time * 0.8 : 0, 0.05)
      const s = hovered ? 1.1 : 1
      mesh.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1)
    }
  })

  return (
    <mesh 
      ref={mesh} 
      onClick={() => setActive(!active)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <octahedronGeometry args={[2, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        thickness={2}
        chromaticAberration={0.5}
        anisotropy={0.3}
        distortion={0.5}
        distortionScale={0.5}
        temporalDistortion={0.1}
        transmission={1}
        color={active ? "#3B82F6" : "#ffffff"}
        roughness={0.1}
      />
      
      {/* Internal Core Glow */}
      <mesh scale={0.4}>
         <sphereGeometry args={[1, 32, 32]} />
         <meshBasicMaterial color="#3B82F6" transparent opacity={0.8} />
      </mesh>
    </mesh>
  )
}

function DataNode({ position, label, value, active, color }) {
  const mesh = useRef()
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      // Orbiting logic
      const targetPos = active 
        ? [position[0] * 3, position[1] * 3, position[2] * 3]
        : [0, 0, 0]
      mesh.current.position.lerp(new THREE.Vector3(...targetPos), 0.05)
      mesh.current.scale.lerp(new THREE.Vector3(active ? 1 : 0, active ? 1 : 0, active ? 1 : 0), 0.1)
      mesh.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={mesh}>
      <mesh>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {`${label}: ${value}`}
      </Text>
    </group>
  )
}

export default function HolographicCrystal({ data }) {
  const [active, setActive] = useState(false)

  return (
    <div className="w-full h-[600px] relative group cursor-pointer">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#60A5FA" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <Crystal active={active} setActive={setActive} data={data} />
        
        <DataNode position={[1, 1, 0]} label="EASY" value={data.easySolved} active={active} color="#22C55E" />
        <DataNode position={[-1, 0.5, 1]} label="MEDIUM" value={data.mediumSolved} active={active} color="#F59E0B" />
        <DataNode position={[0, -1, -1]} label="HARD" value={data.hardSolved} active={active} color="#EF4444" />
        
        <Environment preset="city" />
        <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      </Canvas>
      
      {/* Click Hint */}
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="animate-bounce bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest">
              Tap to Extract Data
           </div>
        </div>
      )}
    </div>
  )
}
