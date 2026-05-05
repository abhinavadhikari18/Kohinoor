"use client"

import { useEffect, useState, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface Diamond {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
  depth: number
}

export default function SparklingDiamonds() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate ~25 diamonds with random positions and depths
    const generatedDiamonds: Diamond[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 200, // Spread across more height
      size: Math.random() * 10 + 4, // 4-14px
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2, // 2-5s
      depth: Math.random() * 0.5 + 0.1, // Parallax speed factor
    }))
    setDiamonds(generatedDiamonds)
  }, [])

  useEffect(() => {
    if (diamonds.length === 0) return

    const ctx = gsap.context(() => {
      diamonds.forEach((diamond) => {
        gsap.to(`.diamond-${diamond.id}`, {
          y: -500 * diamond.depth,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [diamonds])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {diamonds.map((diamond) => (
        <div
          key={diamond.id}
          className={`absolute diamond-${diamond.id}`}
          style={{
            left: `${diamond.left}%`,
            top: `${diamond.top}%`,
            width: diamond.size,
            height: diamond.size,
            animationDelay: `${diamond.delay}s`,
            animationDuration: `${diamond.duration}s`,
          }}
        >
          {/* Diamond SVG with very low opacity shimmer */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-full h-full animate-diamond-sparkle"
            style={{
              opacity: 0.08,
            }}
          >
            <path
              d="M12 2L2 9L12 22L22 9L12 2Z"
              fill="url(#diamondGradient)"
              stroke="url(#diamondStroke)"
              strokeWidth="0.5"
            />
            <defs>
              <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8f4e8" />
                <stop offset="50%" stopColor="#fce7f3" />
                <stop offset="100%" stopColor="#f8f4e8" />
              </linearGradient>
              <linearGradient id="diamondStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#f5c6d0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  )
}
