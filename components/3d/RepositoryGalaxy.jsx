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
  Billboard
} from "@react-three/drei"
import * as THREE from "three"

function RepoStar({ repo, position, active, setActive, index }) {
  const mesh = useRef()
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  
  const isActive = active === index

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      // Gentle floating
      mesh.current.position.y += Math.sin(time + index) * 0.005
      
      // Scaling logic
      const targetScale = isActive ? 2 : (hovered ? 1.5 : 1)
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
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={isActive ? "#60A5FA" : (hovered ? "#93C5FD" : "#1E3A8A")} 
          emissive={isActive ? "#60A5FA" : (hovered ? "#3B82F6" : "#1E3A8A")}
          emissiveIntensity={isActive ? 10 : (hovered ? 5 : 2)}
        />
        
        {/* Glow Layer */}
        <mesh scale={1.5}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshBasicMaterial 
            color={isActive ? "#60A5FA" : "#3B82F6"} 
            transparent 
            opacity={0.1} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      </mesh>

      {/* Label */}
      <Billboard>
        <Text
          position={[0, -0.8, 0]}
          fontSize={isActive ? 0.4 : 0.25}
          color="white"
          maxWidth={2}
          textAlign="center"
          anchorX="center"
          anchorY="top"
          opacity={hovered || isActive ? 1 : 0.3}
        >
          {repo.name.toUpperCase()}
        </Text>
      </Billboard>
    </group>
  )
}

export default function RepositoryGalaxy({ repos, active, setActive }) {
  const starPositions = useMemo(() => {
    return repos.map((_, i) => {
      const angle = (i / repos.length) * Math.PI * 2
      const radius = 8 + Math.random() * 4
      return [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 5,
        Math.sin(angle) * radius
      ]
    })
  }, [repos])

  return (
    <div className="w-full h-[600px] relative bg-black rounded-[3rem] overflow-hidden border border-white/10">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={45} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#60A5FA" />
        
        <group>
          {repos.map((repo, i) => (
            <RepoStar 
              key={repo.id} 
              repo={repo} 
              position={starPositions[i]} 
              active={active} 
              setActive={setActive} 
              index={i} 
            />
          ))}
        </group>

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
        
        {/* Camera auto-move to active star */}
        <CameraController activeIndex={active} positions={starPositions} />
      </Canvas>
      
      {/* HUD Overlay */}
      <div className="absolute bottom-8 left-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-none">
         <p className="text-[10px] font-mono text-blue-400 mb-1 tracking-widest uppercase">Target_Sync: Connected</p>
         <h4 className="text-xl font-black text-white">Repository Galaxy</h4>
         <p className="text-[8px] text-white/30 uppercase mt-2">Select a celestial body to inspect repository data</p>
      </div>
    </div>
  )
}

function CameraController({ activeIndex, positions }) {
  useFrame((state) => {
    if (activeIndex !== undefined && positions[activeIndex]) {
      const target = new THREE.Vector3(...positions[activeIndex])
      // Smoothly move camera towards active star
      const cameraTarget = target.clone().add(new THREE.Vector3(0, 2, 8))
      state.camera.position.lerp(cameraTarget, 0.05)
      state.camera.lookAt(target)
    }
  })
  return null
}
