"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import projects from "@/data/projects"
import dynamic from "next/dynamic"
import { ExternalLink, Github } from "lucide-react"
import { Marquee } from "@/components/ui/Marquee"
import { cn } from "@/lib/utils"

function ProjectCard({ project }) {
  return (
    <a 
      href={project.live || project.github} 
      target="_blank" 
      rel="noreferrer"
      className="group relative block"
    >
      <div
        className={cn(
          "relative w-80 cursor-pointer overflow-hidden rounded-3xl p-8 transition-all duration-500",
          "bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.05)]",
          "hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] hover:-translate-y-2"
        )}
      >
        <div className="flex flex-row items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-2xl">
            {project.id === 1 ? "🧠" : project.id === 2 ? "⚡" : project.id === 3 ? "🌍" : project.id === 4 ? "🤖" : "📊"}
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {project.title}
            </h3>
            <p className="text-xs font-medium text-blue-600 uppercase tracking-widest">
              {project.tech[0]}
            </p>
          </div>
        </div>
        
        <p className="text-slate-600 leading-relaxed mb-8 line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
          <div className="flex gap-2">
            {project.tech.slice(0, 2).map((t) => (
              <span key={t} className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-400 rounded-md uppercase">
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
             <Github size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
             <ExternalLink size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        </div>
      </div>
    </a>
  )
}

const ProjectDeck = dynamic(() => import("@/components/3d/ProjectDeck"), { ssr: false })

export default function Projects() {
  const [active, setActive] = useState(0)
  const activeProject = projects[active]

  return (
    <section id="projects" className="relative py-32 px-6 bg-[#030712] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", filter: "blur(120px)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/30" />
            <span className="text-blue-400 text-xs font-bold tracking-[0.4em] uppercase">04 / Portfolio Showcase</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/30" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
             Project <span className="text-blue-500/20">Deck</span>
          </h2>
          <p className="text-white/40 text-sm mt-6 max-w-2xl mx-auto leading-relaxed">
             A cinematic collection of specialized systems and digital architectures.
             <span className="block mt-2 font-mono text-[10px] text-blue-500/40 uppercase tracking-widest">Hover to pivot // Click to inspect details</span>
          </p>
        </motion.div>

        {/* ── 3D PROJECT DECK ── */}
        <div className="relative mt-12">
          <ProjectDeck projects={projects} active={active} setActive={setActive} />
          
          {/* Navigation Dots (Floating, not boxy) */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
             {projects.map((p, i) => (
               <button
                 key={p.id}
                 onClick={() => setActive(i)}
                 className="group relative h-12 flex flex-col items-center"
               >
                  <div className={`w-0.5 h-6 transition-all duration-500 ${active === i ? "bg-blue-500 h-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]" : "bg-white/20 group-hover:bg-white/40"}`} />
                  <span className={`absolute top-full mt-2 text-[8px] font-black uppercase tracking-[0.3em] transition-all duration-500 whitespace-nowrap ${active === i ? "opacity-100 translate-y-0 text-blue-400" : "opacity-0 -translate-y-2"}`}>
                     {p.title}
                  </span>
               </button>
             ))}
          </div>
        </div>

        {/* Cinematic Backdrop Label */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none z-0 flex justify-center overflow-hidden">
           <h1 className="text-[12vw] font-black text-white whitespace-nowrap tracking-tighter">
             {activeProject.title.toUpperCase()}
           </h1>
        </div>

      </div>
    </section>
  )
}
