"use client"
import { motion } from "framer-motion"
import linkedinData from "@/data/linkedin"
import { MapPin, Briefcase, GraduationCap, ArrowUpRight } from "lucide-react"

const SKILLS_COLORS = {
  Python: "#3776AB",
  JavaScript: "#F7DF1E",
  React: "#61DAFB",
  "Next.js": "#000000",
  "Machine Learning": "#FF6B6B",
  "Data Analysis": "#4ECDC4",
  SQL: "#FF9F43",
  Git: "#F05032",
}

function InfoCard({ icon: Icon, label, value, subValue, highlight = false }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
      className={`p-6 rounded-[2rem] transition-all duration-300 ${
        highlight 
          ? "bg-black text-white" 
          : "bg-white border border-black/5 text-black"
      }`}
    >
      <div className="flex flex-col h-full justify-between gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          highlight ? "bg-white/10" : "bg-black/5"
        }`}>
          <Icon size={20} className={highlight ? "text-white" : "text-black"} />
        </div>
        <div>
          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
            highlight ? "text-white/50" : "text-black/40"
          }`}>
            {label}
          </p>
          <p className={`text-lg font-bold leading-tight ${highlight ? "text-white" : "text-black"}`}>
            {value}
          </p>
          {subValue && (
            <p className={`text-xs mt-1 ${
              highlight ? "text-white/40" : "text-black/30"
            }`}>
              {subValue}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function About() {
  return (
    <section id="about" className="relative py-24 px-6 bg-[#F9F9F9] overflow-hidden text-black">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(#000 1px, transparent 0)", backgroundSize: "40px 40px" }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center text-black">
          
          {/* Left Column — Content */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F2F1] text-[#00695C] border border-[#B2DFDB]"
            >
              <div className="w-2 h-2 rounded-full bg-[#009688] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Available for work
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-black leading-[0.9] tracking-tighter"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Hi, I'm  Nipun,<br />
              <span className="text-black/30">Data Science Student.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-black/60 max-w-xl leading-relaxed font-medium"
            >
              {linkedinData.summary}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a 
                href={linkedinData.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-black text-white font-bold transition-transform hover:scale-105"
              >
                Connect on LinkedIn
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <div className="flex items-center gap-2 px-6 py-4 rounded-full border border-black/10 font-bold text-black">
                📍 {linkedinData.location}
              </div>
            </motion.div>
          </div>

          {/* Right Column — Cards Grid */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <InfoCard 
                  icon={Briefcase}
                  label="Role"
                  value="Data Science Student"
                />
                <InfoCard 
                  icon={GraduationCap}
                  label="Education"
                  value="B. Tech CSE (DS)"
                  subValue="NMIMS University"
                  highlight={true}
                />
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-[2rem] bg-white border border-black/5 text-black"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-4 text-black/40">
                    Soft Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {linkedinData.softSkills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 rounded-full text-[10px] font-bold border border-black/5 bg-[#F9F9F9] text-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
              <div className="space-y-4">
                <InfoCard 
                  icon={MapPin}
                  label="Location"
                  value="India"
                  subValue="Chandigarh"
                />
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-[2rem] bg-white border border-black/5 text-black"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-4 text-black/40">
                    Top Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {linkedinData.skills.map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1 rounded-full text-[10px] font-bold border border-black/5 bg-[#F9F9F9] text-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#009688]/10 to-transparent border border-[#009688]/10 text-black">
                   <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#00695C]">
                    Experience
                  </p>
                  <p className="text-2xl font-black text-black">2+ YRS</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
