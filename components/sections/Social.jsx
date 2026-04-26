"use client"
import { motion } from "framer-motion"
import { Github, Linkedin, Instagram, Mail, Code2, Twitter } from "lucide-react"

const socialLinks = [
  { id: "github", Icon: Github, url: "https://github.com/nipunn-git", color: "#ffffff", label: "GitHub" },
  { id: "linkedin", Icon: Linkedin, url: "https://www.linkedin.com/in/nipun-712b2536b/", color: "#0077b5", label: "LinkedIn" },
  { id: "instagram", Icon: Instagram, url: "https://www.instagram.com/nipunndhiman/", color: "#e1306c", label: "Instagram" },
  { id: "leetcode", Icon: Code2, url: "https://leetcode.com/u/nipunndhiman/", color: "#f89f1b", label: "LeetCode" },
  { id: "gmail", Icon: Mail, url: "mailto:nipunndhiman@gmail.com", color: "#ea4335", label: "Gmail" },
  { id: "x", Icon: Twitter, url: "https://twitter.com/nipundhiman21", color: "#1da1f2", label: "X" },
]

export default function Social() {
  return (
    <section id="social" className="relative py-32 px-6 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-black z-0" />
      <motion.div 
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0 opacity-40"
        style={{
          background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
          backgroundSize: "400% 400%",
        }}
      />
      <div className="absolute inset-0 bg-black/60 z-0 backdrop-blur-[100px]" />
      
      <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center justify-center min-h-[40vh]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="inline-block py-1.5 px-6 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em] mb-8 backdrop-blur-md">
            Connect
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">extraordinary.</span>
          </h2>
        </motion.div>

        {/* Minimal Floating Icons */}
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 py-8">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              title={link.label}
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{ scale: 1.3, y: -10, filter: `drop-shadow(0 0 20px ${link.color})` }}
              className="relative text-white/70 hover:text-white transition-colors duration-300"
            >
              <link.Icon size={42} strokeWidth={1.5} />
            </motion.a>
          ))}
        </div>
        
        <div className="mt-32 w-full pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs font-medium">
           <p>Designed & built by Nipun with Next.js & Three.js</p>
           <p>2026 © All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}

