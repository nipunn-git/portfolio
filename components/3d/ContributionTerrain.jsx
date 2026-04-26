"use client"
import React, { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { 
  PerspectiveCamera, 
  Environment, 
  OrbitControls, 
  Float,
  Text,
  MeshWobbleMaterial
} from "@react-three/drei"
import * as THREE from "three"

function Terrain({ repos }) {
  const mesh = useRef()
  const scanRef = useRef()
  
  // Create height data based on repos
  const { vertices, colors } = useMemo(() => {
    const size = 32
    const v = new Float32Array(size * size * 3)
    const c = new Float32Array(size * size * 3)
    const color = new THREE.Color()

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const idx = (i * size + j) * 3
        const x = i - size / 2
        const z = j - size / 2
        
        // Base height from noise
        let y = Math.sin(i * 0.2) * Math.cos(j * 0.2) * 1.5
        
        // Add peaks for repos
        repos.forEach((repo, rIdx) => {
          const rx = (rIdx % 3) * 8 - 8
          const rz = Math.floor(rIdx / 3) * 8 - 4
          const dist = Math.sqrt((x - rx)**2 + (z - rz)**2)
          if (dist < 4) {
            y += (4 - dist) * (repo.stargazers_count + 1) * 0.5
          }
        })

        v[idx] = x
        v[idx + 1] = y
        v[idx + 2] = z

        // Color based on height
        color.setHSL(0.6 + y * 0.05, 0.8, 0.5)
        c[idx] = color.r
        c[idx + 1] = color.g
        c[idx + 2] = color.b
      }
    }
    return { vertices: v, colors: c }
  }, [repos])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      // Gentle waving
      mesh.current.rotation.y = Math.sin(time * 0.1) * 0.05
    }
    if (scanRef.current) {
      // Scanning laser effect
      scanRef.current.position.z = Math.sin(time * 0.5) * 15
    }
  })

  return (
    <group rotation={[-Math.PI / 6, 0, 0]}>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={vertices.length / 3}
            array={vertices}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.4} 
          vertexColors 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Grid Lines */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[40, 40, 40, 40]} />
        <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.05} />
      </mesh>

      {/* Scanning Laser */}
      <mesh ref={scanRef} position={[0, 0, 0]}>
        <boxGeometry args={[40, 0.1, 0.1]} />
        <meshBasicMaterial color="#60A5FA" transparent opacity={0.5} />
      </mesh>
      
      {/* Repo Labels */}
      {repos.map((repo, i) => {
        const x = (i % 3) * 8 - 8
        const z = Math.floor(i / 3) * 8 - 4
        return (
          <Float key={repo.id} speed={2} floatIntensity={1}>
            <Text
              position={[x, 5, z]}
              fontSize={0.5}
              color="#60A5FA"
              anchorX="center"
              anchorY="middle"
              rotation={[Math.PI/6, 0, 0]}
            >
              {repo.name.toUpperCase()}
            </Text>
          </Float>
        )
      })}
    </group>
  )
}

export default function ContributionTerrain({ repos }) {
  return (
    <div className="w-full h-[600px] relative">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 15, 25]} fov={45} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#60A5FA" />
        
        <Terrain repos={repos} />
        
        <Environment preset="night" />
      </Canvas>
      
      {/* HUD Overlays */}
      <div className="absolute top-8 right-8 text-right pointer-events-none">
         <div className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase">Contribution Terrain Map</div>
         <div className="text-[8px] font-mono text-white/30 mt-1 uppercase">Topography based on Star Metrics // LIVE</div>
      </div>
    </div>
  )
}
