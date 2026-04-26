"use client"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

const WORDS = ["Welcome", "Hello", "नमस्ते", "Bonjour", "こんにちは"]
const WORD_DURATION = 1500

export default function LoadingScreen({ onComplete }) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (index < WORDS.length - 1) {
      const t = setTimeout(() => setIndex((i) => i + 1), WORD_DURATION)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setDone(true)
        setTimeout(onComplete, 900)
      }, WORD_DURATION)
      return () => clearTimeout(t)
    }
  }, [index, onComplete])

  const word = WORDS[index]
  const letters = [...word] // spread handles multi-byte chars

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: "#ffffff" }}
        >
          {/* Subtle radial tint */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 100%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-10">
            {/* Word reveal — Soundify style: each letter clips upward from a mask */}
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                className="flex items-end justify-center"
                style={{ gap: "0.04em" }}
              >
                {letters.map((letter, i) => (
                  <div
                    key={i}
                    style={{ overflow: "hidden", display: "inline-block", lineHeight: 1.15 }}
                  >
                    <motion.span
                      initial={{ y: "105%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      exit={{ y: "-105%", opacity: 0 }}
                      transition={{
                        duration: 0.55,
                        delay: i * 0.045,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        display: "block",
                        fontFamily: "'Sora', 'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: "clamp(4rem, 12vw, 9rem)",
                        color: "#0f0f12",
                        letterSpacing: "-0.04em",
                        lineHeight: 1.1,
                        userSelect: "none",
                      }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </motion.span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Thin progress line */}
            <motion.div
              className="w-12 h-px"
              style={{ background: "rgba(0,0,0,0.15)" }}
            >
              <motion.div
                className="h-full"
                style={{ background: "#0f0f12", transformOrigin: "left" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: WORD_DURATION / 1000 - 0.1, ease: "linear" }}
                key={index}
              />
            </motion.div>

            {/* Apple-style dot loader */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-1.5"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#0f0f12" }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
