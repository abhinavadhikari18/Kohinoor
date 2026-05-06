"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

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

  useGSAP(() => {
    // Scroll-triggered parallax
    gsap.to(".hero-bg-container", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

    gsap.to(".parallax-layer-1", {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

    gsap.to(".parallax-layer-2", {
      y: 150,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

    gsap.to(".parallax-layer-3", {
      y: 200,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

    const handleMouseMove = (e: MouseEvent) => {
      // Don't run on touch devices
      if (window.matchMedia("(pointer: coarse)").matches) return
      
      if (!heroRef.current || !contentRef.current) return
      
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      // Calculate relative positions (-1 to 1)
      const xPos = (clientX / innerWidth - 0.5) * 2
      const yPos = (clientY / innerHeight - 0.5) * 2

      // Animate the main content container with a 3D tilt effect
      gsap.to(contentRef.current, {
        rotateX: -yPos * 4,
        rotateY: xPos * 4,
        transformPerspective: 1200,
        transformOrigin: "center center",
        ease: "power2.out",
        duration: 0.5
      })

      // Mouse-based parallax (smaller values as they combine with scroll)
      gsap.to(".parallax-layer-1-mouse", {
        x: xPos * -15,
        y: yPos * -15,
        ease: "power2.out",
        duration: 0.5
      })

      gsap.to(".parallax-layer-2-mouse", {
        x: xPos * -30,
        y: yPos * -30,
        ease: "power2.out",
        duration: 0.5
      })
      
      gsap.to(".parallax-layer-3-mouse", {
        x: xPos * -45,
        y: yPos * -45,
        ease: "power2.out",
        duration: 0.5
      })
    }
    
    const handleMouseLeave = () => {
      gsap.to([contentRef.current, ".parallax-layer-1-mouse", ".parallax-layer-2-mouse", ".parallax-layer-3-mouse"], {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        ease: "power3.out",
        duration: 1
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    heroRef.current?.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      heroRef.current?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, { scope: heroRef })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section ref={heroRef} id="home" className="relative h-screen w-full overflow-hidden perspective-[1000px]">
      {/* Background Images */}
      <div className="absolute inset-0 hero-bg-container h-[120%] -top-[10%]">
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
              className="object-cover scale-105 md:animate-ken-burns"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Blur overlay for non-active slides transitioning */}
            <div className="absolute inset-0 backdrop-blur-[2px]" />
          </div>
        ))}
      </div>

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-[1]" />
      
      {/* Diamond sparkle overlay effect */}
      <div className="absolute inset-0 opacity-30 z-[1]">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-sparkle" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-sparkle delay-300" />
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-sparkle delay-500" />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-sparkle delay-700" />
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 transform-style-3d perspective-1000"
      >
        {/* Logo */}
        <div className="parallax-layer-3 transform-style-3d">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 animate-float parallax-layer-3-mouse translate-z-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 to-transparent blur-xl" />
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-amber-400/50 shadow-2xl shadow-amber-500/20">
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
        <div className="parallax-layer-2 transform-style-3d">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 md:mb-4 tracking-wider parallax-layer-2-mouse leading-tight translate-z-20">
            <span className="bg-gradient-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
              KOHINOOR
            </span>
          </h1>
        </div>
        
        <div className="parallax-layer-1 transform-style-3d">
          <p className="text-xl md:text-2xl text-amber-100/90 font-medium tracking-widest mb-6 parallax-layer-1-mouse translate-z-10">
            RESTAURANT
          </p>
        </div>

        {/* Tagline */}
        <div className="parallax-layer-1 transform-style-3d">
          <div className="relative parallax-layer-1-mouse px-4 translate-z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent blur-sm" />
            <p className="relative text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light italic tracking-wide">
              &quot;Where Peace, Nature & Love Meet&quot;
            </p>
          </div>
        </div>

        {/* Decorative Diamond Line */}
        <div className="parallax-layer-2 transform-style-3d">
          <div className="flex items-center gap-4 mt-8 parallax-layer-2-mouse translate-z-20">
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
