"use client"
import { Canvas } from "@react-three/fiber"
import { Suspense, Component } from "react"
import dynamic from "next/dynamic"

const Globe = dynamic(() => import("./Globe"), { ssr: false })
const FallbackGlobe = dynamic(
  () => import("./Globe").then((m) => {
    // Return a component that forces useTextures=false
    const Comp = ({ scrollProgress }) => {
      const G = m.default
      return <G scrollProgress={scrollProgress} useTextures={false} />
    }
    Comp.displayName = "FallbackGlobe"
    return { default: Comp }
  }),
  { ssr: false }
)

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          dpr={[1, 1.5]}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <FallbackGlobe scrollProgress={this.props.scrollProgress} />
          </Suspense>
        </Canvas>
      )
    }
    return this.props.children
  }
}

export default function Scene({ scrollProgress = 0 }) {
  return (
    <SceneErrorBoundary scrollProgress={scrollProgress}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          gl.toneMapping = 2 // ACESFilmic
          gl.toneMappingExposure = 1.2
        }}
      >
        <Suspense fallback={null}>
          <Globe scrollProgress={scrollProgress} useTextures={true} />
        </Suspense>
      </Canvas>
    </SceneErrorBoundary>
  )
}
