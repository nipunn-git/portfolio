"use client"
import React, { useRef, useMemo, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, Stars, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

function Nodes({ count, introFinished, setIntroFinished }) {
  const mesh = useRef()
  const linesRef = useRef()
  const startTime = useRef(null)
  
  // Create random start positions and structured target positions
  const [positions, startPositions, lineIndices] = useMemo(() => {
    const p = []
    const pos = new Float32Array(count * 3)
    const startPos = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Target: Sphere-ish cluster
      const radius = 6 + Math.random() * 2
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      
      p.push(new THREE.Vector3(x, y, z))
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      // Start: Scattered much further away for more dramatic gather
      const scatterRadius = 150 + Math.random() * 50
      const sTheta = 2 * Math.PI * Math.random()
      const sPhi = Math.acos(2 * Math.random() - 1)
      startPos[i * 3] = scatterRadius * Math.sin(sPhi) * Math.cos(sTheta)
      startPos[i * 3 + 1] = scatterRadius * Math.sin(sPhi) * Math.sin(sTheta)
      startPos[i * 3 + 2] = scatterRadius * Math.cos(sPhi)
    }

    const indices = []
    const maxDist = 3.5
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (p[i].distanceTo(p[j]) < maxDist) {
          indices.push(p[i].x, p[i].y, p[i].z)
          indices.push(p[j].x, p[j].y, p[j].z)
        }
      }
    }

    return [pos, startPos, new Float32Array(indices)]
  }, [count])

  const currentPositions = useRef(new Float32Array(startPositions))

  useFrame((state) => {
    if (startTime.current === null) startTime.current = state.clock.getElapsedTime()
    const elapsed = state.clock.getElapsedTime() - startTime.current
    const duration = 2.5 // 2.5 seconds for gathering
    const t = Math.min(elapsed / duration, 1)
    
    // Smooth easeOutQuint for gathering
    const ease = 1 - Math.pow(1 - t, 5)

    if (t < 1) {
      for (let i = 0; i < count * 3; i++) {
        currentPositions.current[i] = THREE.MathUtils.lerp(
          startPositions[i],
          positions[i],
          ease
        )
      }
      if (mesh.current) {
        mesh.current.geometry.attributes.position.needsUpdate = true
      }
    } else if (!introFinished) {
      setIntroFinished(true)
    }

    // Gentle rotation
    const rotSpeed = introFinished ? 0.15 : 0.05
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      mesh.current.rotation.y = time * rotSpeed
      mesh.current.rotation.z = time * (rotSpeed * 0.5)
    }
    if (linesRef.current) {
      linesRef.current.rotation.y = time * rotSpeed
      linesRef.current.rotation.z = time * (rotSpeed * 0.5)
      // Fade in lines after intro starts
      linesRef.current.material.opacity = THREE.MathUtils.lerp(0, 0.25, ease)
    }
  })

  return (
    <group>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={currentPositions.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#60A5FA"
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineIndices.length / 3}
            array={lineIndices}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3B82F6"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}

function Scene({ isClicked, introFinished, setIntroFinished }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#60A5FA" />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Nodes count={250} introFinished={introFinished} setIntroFinished={setIntroFinished} />
      </Float>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1.5} />
    </>
  )
}

export default function NeuralNetwork({ onClick, isClicked }) {
  const [introFinished, setIntroFinished] = useState(false)

  return (
    <div 
      className="w-full h-full min-h-[600px] lg:min-h-[800px] relative cursor-pointer group"
      onClick={onClick}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, logarithmicDepthBuffer: true }}
        dpr={[1, 2]} // High DPI support
      >
        <Scene isClicked={isClicked} introFinished={introFinished} setIntroFinished={setIntroFinished} />
      </Canvas>
      
      {/* Decorative Glow Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-blue-500/10 to-transparent blur-3xl opacity-50" />
      
      <AnimatePresence>
        {!isClicked && introFinished && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-blue-500/5 pointer-events-none flex items-center justify-center"
          >
            <div className="w-[450px] h-[450px] rounded-full border border-blue-400/10 animate-[pulse_4s_infinite]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
