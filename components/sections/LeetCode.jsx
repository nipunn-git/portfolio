"use client"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect, useMemo } from "react"
import { useLeetCode } from "@/hooks/useLeetCode"
import dynamic from "next/dynamic"
import { ExternalLink, Trophy, Target, Zap, Activity, Award } from "lucide-react"

function AnimatedNumber({ value, duration = 1.5 }) {
  const [display, setDisplay] = useState(0)
  const inViewRef = useRef(null)
  const isInView = useInView(inViewRef, { once: true })

  useEffect(() => {
    if (!isInView || !value) return
    let start = 0
    const step = value / (duration * 60)
    const timer = setInterval(() => {
      start += step
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return <span ref={inViewRef}>{display.toLocaleString()}</span>
}

function ActivityGraph({ calendar }) {
  const graphRef = useRef(null)
  const isInView = useInView(graphRef, { once: true })

  const dataPoints = useMemo(() => {
    if (!calendar) return []
    // Process calendar data (unix timestamps) into last 30 days
    const now = Math.floor(Date.now() / 1000)
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60
    const dailyData = {}
    
    // Initialize 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date((now - i * 24 * 60 * 60) * 1000).toISOString().split('T')[0]
      dailyData[date] = 0
    }

    Object.entries(calendar).forEach(([timestamp, count]) => {
      const ts = parseInt(timestamp)
      if (ts >= thirtyDaysAgo) {
        const date = new Date(ts * 1000).toISOString().split('T')[0]
        if (dailyData[date] !== undefined) {
          dailyData[date] += count
        }
      }
    })

    return Object.entries(dailyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(entry => entry[1])
  }, [calendar])

  if (dataPoints.length === 0) return null

  const max = Math.max(...dataPoints, 5)
  const width = 400
  const height = 80
  const padding = 5
  
  const points = dataPoints.map((val, i) => {
    const x = (i / (dataPoints.length - 1)) * (width - 2 * padding) + padding
    const y = height - ((val / max) * (height - 2 * padding) + padding)
    return `${x},${y}`
  }).join(' ')

  return (
    <div ref={graphRef} className="w-full mt-4 bg-white/03 rounded-2xl p-4 border border-white/05 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-yellow-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">30-Day Activity</span>
        </div>
        <span className="text-[10px] font-medium text-white/20">Real-time stats</span>
      </div>
      
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
        <defs>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={`M ${padding},${height} L ${points} L ${width - padding},${height} Z`}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* The line */}
        <motion.polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Animated points on hover or subtle animation */}
        {dataPoints.map((val, i) => {
           const x = (i / (dataPoints.length - 1)) * (width - 2 * padding) + padding
           const y = height - ((val / max) * (height - 2 * padding) + padding)
           if (val === 0) return null
           return (
             <motion.circle
               key={i}
               cx={x}
               cy={y}
               r="2"
               fill="#F59E0B"
               initial={{ scale: 0 }}
               animate={isInView ? { scale: [0, 1.5, 1] } : {}}
               transition={{ delay: 1 + i * 0.05 }}
             />
           )
        })}
      </svg>
    </div>
  )
}

function DifficultyRing({ easy, medium, hard, total }) {
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const easyPct = total > 0 ? easy / total : 0
  const mediumPct = total > 0 ? medium / total : 0
  const hardPct = total > 0 ? hard / total : 0

  const segments = [
    { pct: easyPct, color: "#22C55E", offset: 0 },
    { pct: mediumPct, color: "#F59E0B", offset: easyPct },
    { pct: hardPct, color: "#EF4444", offset: easyPct + mediumPct },
  ]

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} />
      {segments.map((seg, i) => (
        <motion.circle
          key={i}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={seg.color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - seg.pct)}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - seg.pct) }}
          transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
          style={{ transformOrigin: "center", transform: `rotate(${seg.offset * 360}deg)` }}
        />
      ))}
    </svg>
  )
}

const DataSwirl = dynamic(() => import("@/components/3d/DataSwirl"), { ssr: false })

export default function LeetCode() {
  const { data, loading, error } = useLeetCode()

  if (error) return null

  const stats = data || {
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    ranking: "0",
    contributionPoints: 0,
    reputation: 0,
  }

  return (
    <section id="leetcode" className="relative py-32 px-6 overflow-hidden bg-[#030712]">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)", filter: "blur(120px)" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="text-blue-400 text-xs font-bold tracking-[0.5em] uppercase">03 / Problem Solving Analysis</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Data <span className="text-blue-500/20">Vortex</span>
          </h2>
        </motion.div>

        {loading ? (
          <div className="h-[600px] flex items-center justify-center">
            <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            
            {/* 3D Data Swirl */}
            <div className="w-full relative">
               <DataSwirl data={stats} />
            </div>

            {/* Subtle Metrics Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-12 flex flex-wrap justify-center gap-12"
            >
               {[
                 { label: "Global Rank", val: `#${stats.ranking}` },
                 { label: "Reputation", val: stats.reputation },
                 { label: "Top Skills", val: "Algorithm Design" }
               ].map((item, i) => (
                 <div key={i} className="text-center group">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-2 group-hover:text-blue-400 transition-colors">{item.label}</p>
                    <p className="text-2xl font-black text-white">{item.val}</p>
                 </div>
               ))}
            </motion.div>

            <motion.a
               href={stats.profileUrl || "https://leetcode.com"} target="_blank" rel="noreferrer"
               whileHover={{ scale: 1.05 }}
               className="mt-16 px-12 py-5 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest flex items-center gap-3"
            >
               Sync Neural Profile <ExternalLink size={14} />
            </motion.a>
          </div>
        )}
      </div>
    </section>
  )
}
