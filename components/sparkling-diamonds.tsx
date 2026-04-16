"use client"

import { useEffect, useState } from "react"

interface Diamond {
  id: number
  left: number
  top: number
  size: number
  delay: number
  duration: number
}

export default function SparklingDiamonds() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([])

  useEffect(() => {
    // Generate ~20 diamonds with random positions
    const generatedDiamonds: Diamond[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 8 + 4, // 4-12px
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2, // 2-5s
    }))
    setDiamonds(generatedDiamonds)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {diamonds.map((diamond) => (
        <div
          key={diamond.id}
          className="absolute"
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
