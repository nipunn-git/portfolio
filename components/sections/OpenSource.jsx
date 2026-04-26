"use client"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CARDS = [
  {
    title: "Portfolio OS",
    repo: "nipunn-git/portfolio",
    desc: "Open-sourced this very 3D immersive portfolio. Next.js 14, Framer Motion, Three.js, NASA earth textures and cinematic animations.",
    stars: 24,
    forks: 7,
    lang: "TypeScript",
    langColor: "#3178C6",
    tags: ["Next.js", "Three.js", "Framer Motion"],
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
    accent: "#3B82F6",
  },
  {
    title: "Lumiere AI",
    repo: "nipunn-git/lumiere",
    desc: "Full-stack clinician dashboard with multi-step signup, real-time analytics and GPT-powered insights. Healthcare AI platform.",
    stars: 18,
    forks: 4,
    lang: "JavaScript",
    langColor: "#F7DF1E",
    tags: ["Node.js", "MongoDB", "OpenAI"],
    gradient: "linear-gradient(135deg, #2d1b4e 0%, #0f172a 100%)",
    accent: "#8B5CF6",
  },
  {
    title: "GrievanceGrid",
    repo: "nipunn-git/grievancegrid",
    desc: "AI-integrated citizen grievance platform with role-based access, automated complaint routing and real-time status tracking.",
    stars: 31,
    forks: 12,
    lang: "TypeScript",
    langColor: "#3178C6",
    tags: ["React", "Express", "PostgreSQL"],
    gradient: "linear-gradient(135deg, #0d3340 0%, #0f172a 100%)",
    accent: "#06B6D4",
  },
  {
    title: "DataViz Explorer",
    repo: "nipunn-git/dataviz",
    desc: "Interactive data analysis and visualization dashboard with Plotly charts, pandas pipelines and Streamlit UI for exploratory science.",
    stars: 15,
    forks: 5,
    lang: "Python",
    langColor: "#3776AB",
    tags: ["Python", "Pandas", "Streamlit"],
    gradient: "linear-gradient(135deg, #1a3a1a 0%, #0f172a 100%)",
    accent: "#22C55E",
  },
]

const SPREAD = [
  { rotate: 0,  x: 0,   y: 0,   z: 0    },
  { rotate: 6,  x: 18,  y: 12,  z: -1   },
  { rotate: 12, x: 36,  y: 22,  z: -2   },
  { rotate: 18, x: 52,  y: 30,  z: -3   },
]

export default function OpenSource() {
  const [active, setActive] = useState(0)
  const [fanned, setFanned] = useState(false)
  const [dragging, setDragging] = useState(false)

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % CARDS.length)
  }, [])

  const goTo = useCallback((i) => {
    setActive(i)
    setFanned(false)
  }, [])

  const card = CARDS[active]

  return (
    <section id="open-source" className="relative py-32 px-6 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-blue-400 text-sm font-bold tracking-widest uppercase">03 / Open Source</span>
            <div className="h-px flex-grow" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.3), transparent)" }} />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mt-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Public Work
          </h2>
          <p className="text-white/40 mt-3 text-sm">Tap the stack · drag to dismiss · fan out to browse</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* ── CARD STACK ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative flex-shrink-0"
            style={{ width: 340, height: 420 }}
          >
            {/* Back cards (stack depth) */}
            {CARDS.map((c, i) => {
              if (i === active) return null
              const depth = ((i - active + CARDS.length) % CARDS.length)
              const sp = SPREAD[Math.min(depth, SPREAD.length - 1)]
              return (
                <motion.div
                  key={c.title}
                  className="absolute inset-0 rounded-3xl cursor-pointer"
                  style={{
                    background: c.gradient,
                    border: `1px solid ${c.accent}22`,
                    zIndex: CARDS.length - depth,
                  }}
                  animate={
                    fanned
                      ? { rotate: sp.rotate, x: sp.x, y: sp.y, scale: 1 - depth * 0.03 }
                      : { rotate: depth * 3, x: depth * 6, y: depth * 5, scale: 1 - depth * 0.04 }
                  }
                  transition={{ type: "spring", stiffness: 220, damping: 28 }}
                  onClick={() => goTo(i)}
                />
              )
            })}

            {/* Active card */}
            <motion.div
              key={active}
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                background: card.gradient,
                border: `1px solid ${card.accent}35`,
                boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${card.accent}15, inset 0 1px 0 rgba(255,255,255,0.07)`,
                zIndex: CARDS.length + 1,
                cursor: dragging ? "grabbing" : "grab",
              }}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, rotate: 0, x: 0 }}
              exit={{ x: 200, opacity: 0, rotate: 12 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              drag="x"
              dragConstraints={{ left: -60, right: 60 }}
              onDragStart={() => setDragging(true)}
              onDragEnd={(_, info) => {
                setDragging(false)
                if (Math.abs(info.offset.x) > 80) advance()
              }}
              whileHover={{ y: -4 }}
              onClick={() => setFanned((f) => !f)}
            >
              {/* Accent glow top */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${card.accent}, transparent)` }} />

              {/* Inner glow */}
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${card.accent}15, transparent 70%)` }} />

              <div className="p-8 h-full flex flex-col">
                {/* Repo path */}
                <p className="text-[10px] font-mono mb-4" style={{ color: `${card.accent}99` }}>
                  github.com / {card.repo}
                </p>

                {/* Title */}
                <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {card.title}
                </h3>

                {/* Desc */}
                <p className="text-white/50 text-sm leading-relaxed flex-1">{card.desc}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-6 mb-6">
                  {card.tags.map((t) => (
                    <span key={t} className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: `${card.accent}18`, border: `1px solid ${card.accent}30`, color: card.accent }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Footer stats */}
                <div className="flex items-center justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: card.langColor }} />
                      <span className="text-white/40 text-xs">{card.lang}</span>
                    </div>
                    <span className="text-white/30 text-xs">⭐ {card.stars}</span>
                    <span className="text-white/30 text-xs">🍴 {card.forks}</span>
                  </div>
                  <span className="text-white/25 text-[10px]">{active + 1} / {CARDS.length}</span>
                </div>
              </div>
            </motion.div>

            {/* Fan hint label */}
            <motion.p
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-center"
              style={{ color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {fanned ? "Click card to select" : "Click to fan out"}
            </motion.p>
          </motion.div>

          {/* ── RIGHT — info panel ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="flex-1 max-w-xl"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg" style={{ background: `linear-gradient(135deg, ${card.accent}, ${card.accent}88)` }}>
                    {card.title[0]}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{card.title}</h3>
                    <p className="text-white/30 text-xs font-mono">github.com/{card.repo}</p>
                  </div>
                </div>

                <p className="text-white/60 leading-relaxed mb-8">{card.desc}</p>

                {/* Stats row */}
                <div className="flex gap-4 flex-wrap mb-8">
                  {[
                    { label: "Stars", val: card.stars },
                    { label: "Forks", val: card.forks },
                    { label: "Language", val: card.lang },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-white/30 text-[10px] uppercase tracking-widest">{s.label}</p>
                      <p className="text-white font-bold text-sm mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</p>
                    </div>
                  ))}
                </div>

                {/* Dot nav */}
                <div className="flex gap-3 items-center">
                  {CARDS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="transition-all duration-300"
                      style={{
                        width: i === active ? 24 : 8,
                        height: 8,
                        borderRadius: 99,
                        background: i === active ? card.accent : "rgba(255,255,255,0.15)",
                      }}
                    />
                  ))}
                  <button
                    onClick={advance}
                    className="ml-4 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105"
                    style={{ background: `${card.accent}22`, border: `1px solid ${card.accent}44`, color: card.accent }}
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
