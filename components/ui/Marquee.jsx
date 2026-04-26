import { cn } from "@/lib/utils"
import React, { useRef, useMemo } from "react"

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ...props
}) {
  const marqueeRef = useRef(null)

  const memoizedChildren = useMemo(
    () => (
      <>
        {Array.from({ length: repeat }, (_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around", {
              "flex-row [gap:var(--gap)] animate-marquee": !vertical,
              "flex-col [gap:var(--gap)] animate-marquee-vertical": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
      </>
    ),
    [repeat, children, vertical, pauseOnHover, reverse]
  )

  return (
    <div
      {...props}
      ref={marqueeRef}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      aria-label={ariaLabel}
    >
      {memoizedChildren}
    </div>
  )
}
