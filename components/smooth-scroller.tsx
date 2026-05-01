"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export default function SmoothScroller() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
    })

    // Integrate lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tick)

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tick)
    }
  }, [pathname])

  return null
}
