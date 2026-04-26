"use client"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGitHub } from "@/hooks/useGitHub"
import dynamic from "next/dynamic"
import { ExternalLink, Github } from "lucide-react"
import Image from "next/image"

const LANG_STYLES = {
  JavaScript: { gradient: "linear-gradient(135deg, #2a2000 0%, #0f172a 100%)", accent: "#F7DF1E", langColor: "#F7DF1E" },
  TypeScript: { gradient: "linear-gradient(135deg, #0d1f40 0%, #0f172a 100%)", accent: "#3B82F6", langColor: "#3178C6" },
  Python:     { gradient: "linear-gradient(135deg, #0d1f30 0%, #0f172a 100%)", accent: "#60A5FA", langColor: "#3776AB" },
  HTML:       { gradient: "linear-gradient(135deg, #2d0d00 0%, #0f172a 100%)", accent: "#F97316", langColor: "#E34F26" },
  CSS:        { gradient: "linear-gradient(135deg, #00122e 0%, #0f172a 100%)", accent: "#38BDF8", langColor: "#1572B6" },
  Java:       { gradient: "linear-gradient(135deg, #1e0a00 0%, #0f172a 100%)", accent: "#F59E0B", langColor: "#B07219" },
  "C++":      { gradient: "linear-gradient(135deg, #2d0020 0%, #0f172a 100%)", accent: "#EC4899", langColor: "#F34B7D" },
  Jupyter:    { gradient: "linear-gradient(135deg, #1e0e00 0%, #0f172a 100%)", accent: "#FB923C", langColor: "#DA5B0B" },
  default:    { gradient: "linear-gradient(135deg, #111827 0%, #0f172a 100%)", accent: "#818CF8", langColor: "#6B7280" },
}

const SPREAD = [
  { rotate: 0,  x: 0,  y: 0,  },
  { rotate: 6,  x: 18, y: 12, },
  { rotate: 12, x: 36, y: 22, },
  { rotate: 18, x: 52, y: 30, },
  { rotate: 22, x: 64, y: 36, },
  { rotate: 26, x: 74, y: 40, },
]

function getStyle(lang) {
  return LANG_STYLES[lang] || LANG_STYLES.default
}

function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-3xl" style={{ width: 340, height: 420, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
    </div>
  )
}

const NebulaHub = dynamic(() => import("@/components/3d/NebulaHub"), { ssr: false })

export default function GitHub() {
  const { profile, repos, loading, error } = useGitHub()
  const [active, setActive] = useState(0)

  const cards = repos || []
  const card = cards[active]

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % Math.max(cards.length, 1))
  }, [cards.length])

  return (
    <section id="github" className="relative py-32 px-6 overflow-hidden bg-[#030712]">
      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", filter: "blur(120px)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-blue-400 text-xs font-bold tracking-[0.5em] uppercase">02 / Open Source Analysis</span>
            <div className="h-px flex-grow bg-gradient-to-r from-blue-400/20 to-transparent" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white mt-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Nebula <span className="text-blue-500/20">Hub</span>
          </h2>

          {/* Profile HUD */}
          {profile && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-6 mt-8 p-4 rounded-3xl bg-white/03 border border-white/05 backdrop-blur-xl w-fit"
            >
              <div className="flex items-center gap-3">
                {profile.avatar_url && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-400/20">
                    <Image src={profile.avatar_url} alt={profile.name || "GitHub"} fill className="object-cover" unoptimized />
                  </div>
                )}
                <div>
                  <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-white font-bold text-sm block tracking-wide">@{profile.login}</a>
                  <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest opacity-60">Verified Dev</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex gap-8 px-2">
                <div>
                   <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-1">Repos</p>
                   <p className="text-sm font-black text-white">{profile.public_repos}</p>
                </div>
                <div>
                   <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-1">Followers</p>
                   <p className="text-sm font-black text-white">{profile.followers}</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Body */}
        {loading ? (
          <div className="h-[500px] flex items-center justify-center">
             <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* ── 3D NEBULA CENTERPIECE ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="lg:col-span-8 relative rounded-[4rem] overflow-hidden border border-white/05 bg-[#0a0a0f] group"
            >
              <NebulaHub repos={cards} active={active} setActive={setActive} />
              
              {/* Overlay HUD */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-12 left-12 z-20">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">Celestial_System_Sync</span>
                 </div>
                 <div className="text-[8px] font-mono text-white/40 uppercase">Target: {card?.name} // Metrics: {card?.stargazers_count}</div>
              </div>
            </motion.div>

            {/* ── REPO DETAILS HUD ── */}
            <div className="lg:col-span-4 space-y-6">
               <AnimatePresence mode="wait">
                 {card && (
                   <motion.div
                     key={card.id}
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -30 }}
                     className="p-10 rounded-[3.5rem] bg-white/03 border border-white/05 backdrop-blur-3xl relative overflow-hidden"
                   >
                     <div className="absolute top-0 right-0 p-10 opacity-05">
                        <Github size={100} />
                     </div>
                     
                     <div className="relative z-10">
                        <p className="text-[10px] font-mono text-blue-400 mb-6 uppercase tracking-[0.4em]">Node_Ref: 0{active + 1}</p>
                        <h3 className="text-3xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          {card.name}
                        </h3>
                        <p className="text-white/40 text-sm leading-relaxed mb-10 min-h-[5em]">
                          {card.description || "Analysis complete. Repository parameters indexed and mapped to celestial coordinates."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                           <div className="p-5 rounded-[2rem] bg-white/03 border border-white/05">
                              <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-1">Language</p>
                              <p className="text-xs font-bold text-white">{card.language || "Unknown"}</p>
                           </div>
                           <div className="p-5 rounded-[2rem] bg-white/03 border border-white/05">
                              <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest mb-1">Stars</p>
                              <p className="text-xs font-bold text-white">{card.stargazers_count} Stars</p>
                           </div>
                        </div>

                        <div className="flex gap-4">
                           <motion.a
                             href={card.html_url} target="_blank" rel="noreferrer"
                             whileHover={{ scale: 1.05 }}
                             className="flex-1 py-5 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                           >
                             Inspect Source <ExternalLink size={12} />
                           </motion.a>
                           <button 
                             onClick={advance}
                             className="w-16 h-16 rounded-2xl bg-white/05 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                           >
                             →
                           </button>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Repository Selector HUD */}
               <div className="p-8 rounded-[3rem] bg-white/03 border border-white/05">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6">Celestial Navigation</p>
                  <div className="flex flex-wrap gap-2">
                     {cards.map((c, i) => (
                       <button
                         key={c.id}
                         onClick={() => setActive(i)}
                         className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${active === i ? "bg-blue-600 text-white" : "bg-white/05 text-white/20 hover:bg-white/10"}`}
                       >
                         0{i+1}
                       </button>
                     ))}
                  </div>
               </div>
            </div>

          </div>
        )}
      </div>
    </section>
  )
}
