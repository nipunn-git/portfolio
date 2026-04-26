"use client"
import React from "react"

// NASA Visible Earth 4K Blue Marble (reliable public CDN via three.js)
const EARTH_TEXTURE =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"

export default function Globe21({ onEarthClick, isClicked }) {
  return (
    <div
      className="flex items-center justify-center w-full h-full relative"
      style={{ cursor: isClicked ? "default" : "pointer" }}
    >
      <style>{`
        @keyframes earthRotate {
          0%   { background-position: 0 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes twinkling {
          0%, 100% { opacity: 0.1; transform: scale(0.7); }
          50%       { opacity: 0.9; transform: scale(1.4); }
        }
        .earth-sphere {
          box-shadow:
            0 0 120px rgba(59,130,246,0.3),
            -24px 0 50px rgba(160,210,255,0.45) inset,
            20px 4px 35px rgba(0,0,0,0.55) inset,
            -30px -5px 55px rgba(160,210,255,0.35) inset,
            180px 0 45px rgba(0,0,0,0.38) inset;
          transition: transform 0.5s ease;
        }
        .earth-sphere:hover {
          transform: scale(1.03);
        }
        .atmo-ring {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: radial-gradient(circle, transparent 60%,
            rgba(80,160,255,0.14) 75%, transparent 86%);
          pointer-events: none;
        }
        .star-dot {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
        }
      `}</style>

      {/* Outer ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: "-80px",
          background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      {/* Earth + atmosphere */}
      <div className="relative" onClick={onEarthClick}>
        <div className="atmo-ring" />
        <div
          className="earth-sphere relative rounded-full overflow-hidden"
          style={{
            width: "clamp(280px, 38vw, 530px)",
            height: "clamp(280px, 38vw, 530px)",
            backgroundImage: `url('${EARTH_TEXTURE}')`,
            backgroundSize: "200% 100%",
            backgroundPosition: "left center",
            animation: "earthRotate 65s linear infinite",
            imageRendering: "crisp-edges",
          }}
        >
          {/* Day-side atmosphere tint */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 32% 32%, rgba(90,170,255,0.22) 0%, rgba(60,140,255,0.08) 40%, transparent 65%)",
              boxShadow: "inset 0 0 90px rgba(30,100,255,0.28)",
            }}
          />
          {/* Specular highlight */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "7%",
              left: "12%",
              width: "32%",
              height: "22%",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.22) 0%, transparent 80%)",
              filter: "blur(8px)",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      {/* Twinkling stars */}
      {[...Array(28)].map((_, i) => {
        const size = Math.random() * 2.2 + 0.5
        return (
          <div
            key={i}
            className="star-dot"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 120 - 10}%`,
              top: `${Math.random() * 120 - 10}%`,
              animation: `twinkling ${2.5 + Math.random() * 4}s infinite`,
              animationDelay: `${Math.random() * 6}s`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
          />
        )
      })}
    </div>
  )
}
