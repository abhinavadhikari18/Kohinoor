"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePerformance } from "./performance-provider"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const heroImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior%20entry-D2HBq4n2aW39dW8YEXYz5jkfr2Ijj6.jpg",
    alt: "Kohinoor Restaurant Exterior Entry"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior1-AH1Twt18GNPfjwuNwEKy9SrW3qcZnD.jpg",
    alt: "Kohinoor Restaurant Night View"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kohinoor%20swing-z0vmquldtvGjN8WG8gP0OwV5hQ0pZq.jpg",
    alt: "Kohinoor Swing"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cabin3-kXpd70HFwn5TLrWILNETQ0vyGFUGS9.jpg",
    alt: "Private Cabin"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ambience-cayR3cTDDha0e0HIYm1bptkiifzlr5.jpg",
    alt: "Kohinoor Ambience"
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom1-jWqxDbDWEIRo6VCC7dYB24PnPtZeeE.jpg",
    alt: "Cozy Bedroom"
  },
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const { isLowEnd } = usePerformance()

  useGSAP(() => {
    if (isLowEnd) return // Optimization: Disable heavy animations on low-end devices

    const mm = gsap.matchMedia()

    // Performance: Only run parallax scroll on desktop/non-touch devices
    mm.add("(min-width: 768px) and (pointer: fine)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })

      tl.to(".hero-bg-container", { yPercent: 20, ease: "none" }, 0)
        .to(".parallax-layer-1", { y: 50, ease: "none" }, 0)
        .to(".parallax-layer-2", { y: 100, ease: "none" }, 0)
        .to(".parallax-layer-3", { y: 150, ease: "none" }, 0)

      if (contentRef.current) {
        const xTo = gsap.quickTo(contentRef.current, "rotateY", { duration: 0.4, ease: "power2.out" })
        const yTo = gsap.quickTo(contentRef.current, "rotateX", { duration: 0.4, ease: "power2.out" })
        
        const m1xTo = gsap.quickTo(".parallax-layer-1-mouse", "x", { duration: 0.4, ease: "power2.out" })
        const m1yTo = gsap.quickTo(".parallax-layer-1-mouse", "y", { duration: 0.4, ease: "power2.out" })
        
        const m2xTo = gsap.quickTo(".parallax-layer-2-mouse", "x", { duration: 0.4, ease: "power2.out" })
        const m2yTo = gsap.quickTo(".parallax-layer-2-mouse", "y", { duration: 0.4, ease: "power2.out" })
        
        const m3xTo = gsap.quickTo(".parallax-layer-3-mouse", "x", { duration: 0.4, ease: "power2.out" })
        const m3yTo = gsap.quickTo(".parallax-layer-3-mouse", "y", { duration: 0.4, ease: "power2.out" })

        const handleMouseMove = (e: MouseEvent) => {
          const { clientX, clientY } = e
          const { innerWidth, innerHeight } = window
          const xPos = (clientX / innerWidth - 0.5) * 2
          const yPos = (clientY / innerHeight - 0.5) * 2

          xTo(xPos * 4)
          yTo(-yPos * 4)
          
          m1xTo(xPos * -10)
          m1yTo(yPos * -10)
          
          m2xTo(xPos * -20)
          m2yTo(yPos * -20)
          
          m3xTo(xPos * -30)
          m3yTo(yPos * -30)
        }
        
        const handleMouseLeave = () => {
          gsap.to([contentRef.current, ".parallax-layer-1-mouse", ".parallax-layer-2-mouse", ".parallax-layer-3-mouse"], {
            rotateX: 0, rotateY: 0, x: 0, y: 0,
            ease: "power3.out", duration: 1
          })
        }

        window.addEventListener("mousemove", handleMouseMove)
        heroRef.current?.addEventListener("mouseleave", handleMouseLeave)

        return () => {
          window.removeEventListener("mousemove", handleMouseMove)
          heroRef.current?.removeEventListener("mouseleave", handleMouseLeave)
        }
      }
    })

    return () => mm.revert()
  }, { scope: heroRef, dependencies: [isLowEnd] })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, isLowEnd ? 6000 : 4000)
    return () => clearInterval(interval)
  }, [isLowEnd])

  return (
    <section ref={heroRef} id="home" className="relative h-screen w-full overflow-hidden perspective-[1000px]">
      {/* Background Images */}
      <div className={`absolute inset-0 hero-bg-container ${isLowEnd ? 'h-full top-0' : 'h-[110%] md:h-[115%] -top-[5%] md:-top-[7%]'} will-change-transform`}>
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Blur overlay for non-active slides transitioning */}
            {!isLowEnd && <div className="absolute inset-0 backdrop-blur-[1px]" />}
          </div>
        ))}
      </div>

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-[1]" />
      
      {/* Diamond sparkle overlay effect */}
      {!isLowEnd && (
        <div className="absolute inset-0 opacity-20 z-[1] pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-sparkle" />
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-sparkle delay-300" />
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-sparkle delay-500" />
        </div>
      )}

      {/* Content */}
      <div 
        ref={contentRef}
        className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-4 ${!isLowEnd ? 'transform-style-3d will-change-transform' : ''}`}
      >
        {/* Logo */}
        <div className={!isLowEnd ? "parallax-layer-3 transform-style-3d" : ""}>
          <div className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-4 ${!isLowEnd ? 'animate-float parallax-layer-3-mouse translate-z-20' : ''}`}>
            {!isLowEnd && <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 to-transparent blur-xl" />}
            <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-amber-400/40 shadow-xl ${!isLowEnd ? 'shadow-amber-500/10' : ''}`}>
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.PNG-RflDppQJdLrSmpnp64Ad8P8rG1e8KP.jpeg"
                alt="Kohinoor Restaurant Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Restaurant Name */}
        <div className={`${!isLowEnd ? 'parallax-layer-2 transform-style-3d' : ''} max-w-[95vw] md:max-w-3xl mx-auto px-2`}>
          <h2 className={`font-serif text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg font-medium text-amber-200/90 mb-2 md:mb-3 uppercase tracking-normal sm:tracking-[0.15em] md:tracking-[0.2em] ${!isLowEnd ? 'parallax-layer-2-mouse translate-z-20' : ''}`}>
            Best Romantic Restaurant in Bhairahawa, Butwal & Kotihawa
          </h2>
          <h1 className={`font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-3 md:mb-4 tracking-normal sm:tracking-wide ${!isLowEnd ? 'parallax-layer-2-mouse leading-[1] sm:leading-[1.1] md:leading-none translate-z-20' : ''}`}>
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
              KOHINOOR
            </span>
          </h1>
        </div>
        
        <div className={!isLowEnd ? "parallax-layer-1 transform-style-3d" : ""}>
          <p className={`text-lg sm:text-2xl md:text-3xl text-amber-100/90 font-medium tracking-[0.02em] sm:tracking-[0.05em] md:tracking-widest mb-4 md:mb-6 ${!isLowEnd ? 'parallax-layer-1-mouse translate-z-10' : ''}`}>
 NATURAL VIBES , ROMANTIC CABINS & COZY ROOMS
          </p>
        </div>

        {/* Tagline */}
        <div className={!isLowEnd ? "parallax-layer-1 transform-style-3d" : ""}>
          <div className={`relative ${!isLowEnd ? 'parallax-layer-1-mouse px-4 translate-z-10' : 'px-4'}`}>
            {!isLowEnd && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent blur-md" />}
            <p className="relative text-xl sm:text-2xl md:text-3xl text-white/90 font-light italic tracking-wide leading-relaxed">     
              &quot;Where Peace, Nature & Love Meet&quot;
            </p>
          </div>
        </div>
        {/* Decorative Diamond Line */}
        <div className={!isLowEnd ? "parallax-layer-2 transform-style-3d" : ""}>
          <div className={`flex items-center gap-4 mt-8 ${!isLowEnd ? 'parallax-layer-2-mouse translate-z-20' : ''}`}>
            <div className="w-16 md:w-24 h-px bg-gradient-to-r from-transparent to-amber-400/70" />
            <div className="w-3 h-3 rotate-45 bg-amber-400/80" />
            <div className="w-16 md:w-24 h-px bg-gradient-to-l from-transparent to-amber-400/70" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {heroImages.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-amber-400 w-6"
                : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
