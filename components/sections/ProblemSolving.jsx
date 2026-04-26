"use client"
import { motion } from "framer-motion"

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
}

const METRICS = [
  { label: "Problems Solved", value: "340+", sub: "LeetCode & HackerRank", color: "#3B82F6" },
  { label: "Acceptance Rate", value: "68%", sub: "Above platform avg", color: "#8B5CF6" },
  { label: "Contest Rating", value: "1480", sub: "Top 25%", color: "#06B6D4" },
]

const SKILLS_BREAKDOWN = [
  { label: "Data Structures", pct: 88, color: "#3B82F6" },
  { label: "Algorithms", pct: 76, color: "#8B5CF6" },
  { label: "Dynamic Programming", pct: 62, color: "#06B6D4" },
  { label: "System Design", pct: 55, color: "#F59E0B" },
]

const DIFFICULTY = [
  { label: "Easy", count: 160, color: "#22C55E" },
  { label: "Medium", count: 140, color: "#F59E0B" },
  { label: "Hard", count: 40, color: "#EF4444" },
]

export default function ProblemSolving() {
  const total = DIFFICULTY.reduce((s, d) => s + d.count, 0)

  return (
    <section id="problem-solving" className="relative py-32 px-6 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Ambient glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>

          {/* Header */}
          <motion.div variants={item} className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-blue-400 text-sm font-bold tracking-widest uppercase">02 / Problem Solving</span>
              <div className="h-px flex-grow" style={{ background: "linear-gradient(90deg, rgba(59,130,246,0.3), transparent)" }} />
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white mt-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Competitive Edge
            </h2>
            <p className="text-white/40 mt-3 max-w-xl text-sm leading-relaxed">
              Consistent problem solving across platforms — measuring algorithmic thinking, speed, and depth.
            </p>
          </motion.div>

          {/* Main dashboard grid */}
          <div className="grid lg:grid-cols-3 gap-5">

            {/* LEFT — large metric + difficulty donut-style */}
            <motion.div
              variants={item}
              className="lg:col-span-1 rounded-3xl p-7 relative overflow-hidden flex flex-col gap-6"
              style={{
                background: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(3,7,18,0.95) 100%)",
                border: "1px solid rgba(59,130,246,0.18)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none" style={{ background: "radial-gradient(circle at top right, rgba(59,130,246,0.1), transparent 70%)" }} />

              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Difficulty Split</p>

              {/* Ring chart — CSS only */}
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    {(() => {
                      let offset = 0
                      const r = 46, circ = 2 * Math.PI * r
                      return DIFFICULTY.map((d) => {
                        const dash = (d.count / total) * circ
                        const el = (
                          <circle
                            key={d.label}
                            cx="60" cy="60" r={r}
                            fill="none"
                            stroke={d.color}
                            strokeWidth="14"
                            strokeDasharray={`${dash - 2} ${circ - dash + 2}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                          />
                        )
                        offset += dash
                        return el
                      })
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{total}</span>
                    <span className="text-white/40 text-[10px] uppercase tracking-widest">Solved</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2">
                {DIFFICULTY.map((d) => (
                  <div key={d.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-white/60 text-xs">{d.label}</span>
                    </div>
                    <span className="text-white/80 text-xs font-bold">{d.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CENTER — skill bars Kvant style */}
            <motion.div
              variants={item}
              className="lg:col-span-1 rounded-3xl p-7 flex flex-col gap-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(15,23,42,0.95) 0%, rgba(3,7,18,0.95) 100%)",
                border: "1px solid rgba(139,92,246,0.18)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <div className="absolute bottom-0 left-0 w-60 h-60 pointer-events-none" style={{ background: "radial-gradient(circle at bottom left, rgba(139,92,246,0.08), transparent 70%)" }} />

              <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Skill Proficiency</p>

              <div className="flex flex-col gap-5 flex-1 justify-center">
                {SKILLS_BREAKDOWN.map((s, i) => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-white/70 text-xs font-medium">{s.label}</span>
                      <span className="text-xs font-bold" style={{ color: s.color }}>{s.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: 0.2 + i * 0.12, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini sparkline decoration */}
              <div className="mt-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-3">Weekly Activity</p>
                <div className="flex items-end gap-1 h-10">
                  {[4, 7, 3, 8, 6, 9, 5, 10, 7, 8, 6, 11, 9, 7].map((v, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ background: "rgba(59,130,246,0.5)" }}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(v / 11) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT — metric cards stack */}
            <motion.div variants={item} className="lg:col-span-1 flex flex-col gap-4">
              {METRICS.map((m) => (
                <motion.div
                  key={m.label}
                  whileHover={{ x: 4, scale: 1.01 }}
                  className="rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(3,7,18,0.9) 100%)",
                    border: `1px solid ${m.color}22`,
                    boxShadow: `0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
                    flex: 1,
                  }}
                >
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at left, ${m.color}0d 0%, transparent 70%)` }} />
                  <div className="relative z-10 flex-1">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">{m.label}</p>
                    <p className="font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", lineHeight: 1, color: m.color }}>{m.value}</p>
                    <p className="text-white/30 text-[10px] mt-1">{m.sub}</p>
                  </div>
                  {/* Glowing dot */}
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color, boxShadow: `0 0 10px ${m.color}` }} />
                </motion.div>
              ))}

              {/* Platforms row */}
              <motion.div
                whileHover={{ x: 4 }}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(3,7,18,0.9) 100%)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">Active Platforms</p>
                <div className="flex gap-3">
                  {["LeetCode", "HackerRank", "CodeChef"].map((p) => (
                    <span key={p} className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)", color: "#60A5FA" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
