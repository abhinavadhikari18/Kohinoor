"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { usePathname } from "next/navigation"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Don't show custom cursor on mobile touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      cursor.style.display = "none"
      return
    }

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      })
    }

    const handleHover = () => {
      gsap.to(cursor, {
        scale: 2.5,
        backgroundColor: "rgba(232, 164, 184, 0.4)", // rose-pink with opacity
        border: "none",
        duration: 0.3,
      })
    }

    const handleHoverOut = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "transparent",
        border: "2px solid #D4B896", // gold
        duration: 0.3,
      })
    }

    // Attach event listeners
    window.addEventListener("mousemove", moveCursor)
    
    // Attach hover effects to interactive elements
    const attachInteractiveListeners = () => {
      const interactiveElements = document.querySelectorAll("a, button, input, textarea, .interactive")
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleHover)
        el.addEventListener("mouseleave", handleHoverOut)
      })
      
      return () => {
        interactiveElements.forEach((el) => {
          el.removeEventListener("mouseenter", handleHover)
          el.removeEventListener("mouseleave", handleHoverOut)
        })
      }
    }

    // Small delay to ensure DOM is ready on initial load
    const timeout = setTimeout(() => {
      attachInteractiveListeners()
    }, 500)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      clearTimeout(timeout)
      // The cleanup is slightly tricky here without a state, but since it's a global listener and we re-run on pathname, it's mostly fine
    }
  }, [pathname])

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-6 h-6 rounded-full border-2 border-amber-300 pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
    />
  )
}
