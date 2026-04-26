"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "About", href: "#about" },
  { label: "GitHub", href: "#github" },
  { label: "LeetCode", href: "#leetcode" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#social" },
]

// Sections with light backgrounds — navbar must invert to dark glass
const LIGHT_SECTIONS = ["projects"]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const sy = window.scrollY
      setScrolled(sy > 50)

      // Detect if any light-background section is occupying the navbar zone
      let light = false
      for (const id of LIGHT_SECTIONS) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // Section is "under" the navbar if its top is above 80px and bottom > 80px
        if (rect.top < 80 && rect.bottom > 80) {
          light = true
          break
        }
      }
      setIsLight(light)
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleNav = (href) => {
    setMenuOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  // Dynamic glass styles based on section background
  const navBg = !scrolled
    ? "transparent"
    : isLight
    ? "rgba(245,247,250,0.82)"
    : "rgba(3,7,18,0.75)"

  const navBorder = !scrolled
    ? "none"
    : isLight
    ? "1px solid rgba(0,0,0,0.07)"
    : "1px solid rgba(255,255,255,0.07)"

  const logoText = isLight ? "text-slate-900" : "text-white/90"
  const linkColor = isLight
    ? "text-slate-600 hover:text-slate-900"
    : "text-white/55 hover:text-white"
  const underlineColor = isLight ? "bg-blue-600" : "bg-gradient-to-r from-blue-500 to-purple-500"
  const mobileIconColor = isLight ? "text-slate-600" : "text-white/70"

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: navBg,
          backdropFilter: scrolled ? "blur(22px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(22px) saturate(180%)" : "none",
          borderBottom: navBorder,
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.a href="#" className="flex items-center gap-2 group" whileHover={{ scale: 1.02 }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }}
            >
              N
            </div>
            <span className={cn("font-semibold tracking-wide text-sm transition-colors duration-300", logoText)}>
              Nipun
            </span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={cn(
                  "text-sm font-medium transition-colors duration-300 relative group",
                  linkColor
                )}
              >
                {link.label}
                <span className={cn("absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full", underlineColor)} />
              </button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className={cn("md:hidden p-1 transition-colors duration-300", mobileIconColor)}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-4 right-4 z-40 rounded-2xl p-4 flex flex-col gap-3"
            style={{
              background: isLight ? "rgba(245,247,250,0.97)" : "rgba(10,10,20,0.97)",
              backdropFilter: "blur(20px)",
              border: isLight ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={cn(
                  "text-left px-4 py-2.5 rounded-xl transition-all text-sm font-medium",
                  isLight
                    ? "text-slate-700 hover:text-slate-900 hover:bg-black/5"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
