"use client"
import React, { useRef, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { 
  PerspectiveCamera, 
  Environment, 
  Float,
  Text,
  Points,
  PointMaterial,
  useCursor,
  MeshDistortMaterial
} from "@react-three/drei"
import * as THREE from "three"

function SwirlParticles({ active }) {
  const points = useRef()
  const count = 5000
  
  const [positions, setPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360)
      const phi = THREE.MathUtils.randFloatSpread(360)
      pos[i * 3] = 12 * Math.sin(theta) * Math.cos(phi)
      pos[i * 3 + 1] = 12 * Math.sin(theta) * Math.sin(phi)
      pos[i * 3 + 2] = 12 * Math.cos(theta)
    }
    return [pos]
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (points.current) {
      points.current.rotation.y = time * 0.1
      points.current.rotation.z = time * 0.05
      
      // Contraction effect when active
      const s = active ? 0.3 : 1
      points.current.scale.lerp(new THREE.Vector3(s, s, s), 0.05)
    }
  })

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#3B82F6"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

function StatNode({ label, val, position, color, active }) {
  const groupRef = useRef()
  
  useFrame(() => {
    if (groupRef.current) {
      const targetScale = active ? 1 : 0
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <group ref={groupRef} scale={[0,0,0]}>
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <MeshDistortMaterial color={color} speed={2} distort={0.3} radius={0.6} />
          </mesh>
          <Text
            position={[0, 1.2, 0]}
            fontSize={0.25}
            color="white"
            anchorX="center"
          >
            {label.toUpperCase()}
          </Text>
          <Text
            position={[0, 0.8, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
          >
            {val}
          </Text>
        </group>
      </group>
    </Float>
  )
}

function CentralOrb({ active, setActive, stats }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      mesh.current.rotation.y = time * 0.5
      mesh.current.scale.lerp(new THREE.Vector3(hovered ? 1.2 : 1, hovered ? 1.2 : 1, hovered ? 1.2 : 1), 0.1)
    }
  })

  return (
    <group>
      <mesh 
        ref={mesh} 
        onClick={() => setActive(!active)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[2, 4]} />
        <meshStandardMaterial 
          color="#1E3A8A" 
          emissive="#3B82F6" 
          emissiveIntensity={hovered ? 8 : 4} 
          wireframe
        />
      </mesh>
      
      {/* Pop-out Nodes */}
      <StatNode label="Easy" val={stats.easySolved} position={[-6, 2, 0]} color="#4ADE80" active={active} />
      <StatNode label="Medium" val={stats.mediumSolved} position={[6, 2, 0]} color="#FBBF24" active={active} />
      <StatNode label="Hard" val={stats.hardSolved} position={[0, -5, 0]} color="#EF4444" active={active} />

      {/* Total Solved floating in center */}
      <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 4.5, 0]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {stats.totalSolved}
        </Text>
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.3}
          color="#3B82F6"
          anchorX="center"
          anchorY="middle"
          opacity={0.6}
        >
          TOTAL SYSTEMS SOLVED
        </Text>
      </Float>
    </group>
  )
}

export default function DataSwirl({ data }) {
  const [active, setActive] = useState(false)

  return (
    <div className="w-full h-[700px] relative group cursor-pointer overflow-hidden rounded-[4rem] bg-[#030712] border border-white/05 shadow-2xl">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={40} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={3} color="#60A5FA" />
        
        <SwirlParticles active={active} />
        <CentralOrb active={active} setActive={setActive} stats={data} />
        
        <Environment preset="night" />
      </Canvas>
      
      {/* Side HUD Elements */}
      <div className="absolute top-12 left-12 flex flex-col gap-8 pointer-events-none">
         <div className="group">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2 group-hover:text-blue-400 transition-colors">Global Rank</p>
            <p className="text-4xl font-black text-white">#{data.ranking}</p>
         </div>
         <div className="group">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2 group-hover:text-blue-400 transition-colors">Neural Reputation</p>
            <p className="text-4xl font-black text-white">{data.reputation}</p>
         </div>
      </div>

      {/* Extract Hint */}
      {!active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="animate-pulse bg-blue-500/10 backdrop-blur-xl px-12 py-6 rounded-full border border-blue-500/20 text-white font-black text-xs uppercase tracking-[0.5em]">
              Tap Core to Extract Stats
           </div>
        </div>
      )}
    </div>
  )
}
