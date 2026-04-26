"use client"
import { useRef } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import * as THREE from "three"
import Particles from "./Particles"

// Using reliable CDN URLs — no local texture files needed
const TEXTURE_URLS = {
  earth: "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  bump: "https://unpkg.com/three-globe/example/img/earth-topology.png",
  clouds: "https://unpkg.com/three-globe/example/img/clouds.png",
}

function EarthMesh({ scrollProgress }) {
  const meshRef = useRef()
  const groupRef = useRef()
  const cloudsRef = useRef()

  const [earthTexture, bumpTexture, cloudsTexture] = useLoader(THREE.TextureLoader, [
    TEXTURE_URLS.earth,
    TEXTURE_URLS.bump,
    TEXTURE_URLS.clouds,
  ])

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002
    if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0015
    if (groupRef.current) {
      const targetX = scrollProgress * -3.5
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.05
      )
    }
  })

  return (
    <group ref={groupRef}>
      {/* Atmosphere glow */}
      <Sphere args={[1.12, 64, 64]}>
        <meshPhongMaterial
          color="#4488ff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Earth sphere */}
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <meshPhongMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={0.012}
          shininess={8}
        />
      </Sphere>

      {/* Clouds */}
      <Sphere args={[1.013, 64, 64]} ref={cloudsRef}>
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </Sphere>
    </group>
  )
}

function FallbackEarth({ scrollProgress }) {
  const meshRef = useRef()
  const groupRef = useRef()

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.004
    if (groupRef.current) {
      const targetX = scrollProgress * -3.5
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        0.05
      )
    }
  })

  return (
    <group ref={groupRef}>
      <Sphere args={[1.1, 64, 64]}>
        <meshPhongMaterial color="#4488ff" transparent opacity={0.06} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1, 64, 64]} ref={meshRef}>
        <meshStandardMaterial
          color="#1a3a6e"
          roughness={0.6}
          metalness={0.2}
          emissive="#0a1a40"
          emissiveIntensity={0.4}
        />
      </Sphere>
    </group>
  )
}

export default function Globe({ scrollProgress = 0, useTextures = true }) {
  return (
    <group>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={2.5} color="#fff5e0" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#3B82F6" />
      <pointLight position={[0, 5, 2]} intensity={0.25} color="#8B5CF6" />

      <Particles count={1200} />

      {useTextures ? (
        <EarthMesh scrollProgress={scrollProgress} />
      ) : (
        <FallbackEarth scrollProgress={scrollProgress} />
      )}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.45}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.75}
        makeDefault
      />
    </group>
  )
}
