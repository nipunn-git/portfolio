"use client"
import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { useMediaQuery } from "@/hooks/useMediaQuery"

const NeuralNetwork = dynamic(() => import("@/components/3d/NeuralNetwork"), { ssr: false })

const TITLES = ["Data Science Student", "Frontend Developer", "AI Explorer"]

function TypewriterTitles() {
  const [idx, setIdx] = useState(0)
  const cycle = useCallback(() => setIdx((i) => (i + 1) % TITLES.length), [])
  return (
    <motion.div className="flex items-center gap-2 text-sm md:text-base font-medium" onClick={cycle}>
      <span className="text-white/40">→</span>
      <motion.span
        key={idx}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        className="text-gradient cursor-pointer select-none"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {TITLES[idx]}
      </motion.span>
    </motion.div>
  )
}


function ParticleText({ text, delay = 0 }) {
  return (
    <div className="flex flex-wrap justify-center gap-x-2">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0, filter: "blur(10px)", y: Math.random() * 20 - 10, x: Math.random() * 20 - 10 }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0, x: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: delay + i * 0.05,
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  )
}

export default function Hero() {
  const [isExplored, setIsExplored] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const sectionRef = useRef(null)

  const handleToggleExplore = useCallback(() => {
    setIsExplored(prev => !prev)
  }, [])

  // Spring config for recoil bounce
  const springTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen overflow-hidden"
      style={{ display: "flex", alignItems: "center" }}
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Bottom dark fade */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 h-52 pointer-events-none"
        style={{ background: "linear-gradient(to top, #030712 0%, transparent 100%)" }}
      />

      {/* ── NEURAL NETWORK ── springs left on click */}
      <motion.div
        className="absolute z-[5] w-full h-full flex items-center justify-center"
        animate={
          isExplored
            ? {
                x: isDesktop ? "-25%" : "0%",
                y: isDesktop ? "0%" : "-20%",
                scale: isDesktop ? 0.85 : 0.65,
              }
            : { x: "0%", y: "0%", scale: 1 }
        }
        transition={springTransition}
      >
        <NeuralNetwork onClick={handleToggleExplore} isClicked={isExplored} />
      </motion.div>

      {/* ── CLICK HINT ── gathered from particles */}
      <AnimatePresence>
        {!isExplored && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 pointer-events-none"
          >
            <div className="text-[10px] tracking-[0.4em] uppercase font-black text-blue-400/80">
              <ParticleText text="CLICK TO EXPLORE" delay={2} />
            </div>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              className="w-[1.5px] h-12 origin-top"
              style={{ background: "linear-gradient(to bottom, #3B82F6, transparent)" }}
              transition={{ delay: 3, duration: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO TEXT ── gathered from particles/blur */}
      <AnimatePresence mode="wait">
        {isExplored && (
          <motion.div
            key="info-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)", scale: 1.1 }}
            className="absolute z-20 w-full h-full pointer-events-none flex items-center"
            style={{
              paddingRight: isDesktop ? "8%" : "5%",
              paddingLeft: isDesktop ? "55%" : "5%",
              justifyContent: isDesktop ? "flex-start" : "center",
              textAlign: isDesktop ? "left" : "center",
            }}
          >
            <div className="max-w-xl space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest pointer-events-auto"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Open to opportunities
              </motion.div>

              {/* Name */}
              <div className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
                <ParticleText text="Nipun" delay={0.2} />
              </div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pointer-events-auto"
              >
                <TypewriterTitles />
              </motion.div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-white/50 text-sm md:text-base leading-relaxed max-w-sm"
                style={{ marginLeft: isDesktop ? "0" : "auto", marginRight: isDesktop ? "0" : "auto" }}
              >
                Building at the intersection of{" "}
                <span className="text-white/80 font-bold">Data Science</span>,{" "}
                <span className="text-white/80 font-bold">AI</span> and{" "}
                <span className="text-white/80 font-bold">Modern Web</span>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-wrap gap-4 pointer-events-auto"
                style={{ justifyContent: isDesktop ? "flex-start" : "center" }}
              >
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.05, x: 5 }}
                  className="px-8 py-3 rounded-full bg-white text-black font-bold text-sm transition-all"
                >
                  View Projects
                </motion.a>
                <motion.button
                  onClick={handleToggleExplore}
                  className="px-8 py-3 rounded-full border border-white/20 text-white/70 font-bold text-sm hover:bg-white/5 transition-all"
                >
                  Go Back
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close button for mobile/easy access */}
      <AnimatePresence>
        {isExplored && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleToggleExplore}
            className="absolute top-10 right-10 z-50 text-white/30 hover:text-white transition-colors"
          >
            [ ESCAPE ]
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}
