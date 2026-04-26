"use client"
import { useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import Navbar from "@/components/ui/Navbar"
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import GitHub from "@/components/sections/GitHub"
import LeetCode from "@/components/sections/LeetCode"
import Projects from "@/components/sections/Projects"
import Social from "@/components/sections/Social"

// Lazy load heavy components
const LoadingScreen = dynamic(() => import("@/components/loaders/LoadingScreen"), { ssr: false })

// Slim section divider
function SectionDivider() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative h-px mx-auto max-w-7xl"
    >
      <div
        className="h-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-1/2 -translate-x-1/2 -top-1 w-1.5 h-1.5 rounded-full"
        style={{ background: "rgba(255,255,255,0.25)" }}
      />
    </motion.div>
  )
}

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {/* Loading Screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Main App */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s ease 0.2s",
          pointerEvents: loaded ? "all" : "none",
        }}
      >
        <Navbar />

        <main>
          {/* Hero — full viewport, earth interaction */}
          <Hero />

          {/* Dark content sections */}
          <div className="relative z-10" style={{ background: "#030712" }}>

            <About />

            <SectionDivider />

            <GitHub />

            <SectionDivider />

            <LeetCode />

            <SectionDivider />

            {/* Projects — white section with blend gradients built in */}
            <Projects />

            <Social />
          </div>
        </main>
      </div>
    </>
  )
}
