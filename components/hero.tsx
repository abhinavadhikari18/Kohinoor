"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative min-h-[100svh] w-full overflow-hidden">
      {/* Background Images */}
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
            className="object-cover scale-105"
            priority={index === 0}
          />
          {/* Blur overlay for non-active slides transitioning */}
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
      ))}

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Diamond sparkle overlay effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-sparkle" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full animate-sparkle delay-300" />
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-sparkle delay-500" />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-sparkle delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        {/* Logo */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 animate-float">
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-400/30 to-transparent blur-xl" />
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

        {/* Restaurant Name */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-wider">
          <span className="bg-linear-to-r from-amber-200 via-amber-100 to-amber-200 bg-clip-text text-transparent">
            KOHINOOR
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-amber-100/90 font-medium tracking-widest mb-6">
          RESTAURANT
        </p>

        {/* Tagline */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-amber-400/20 to-transparent blur-sm" />
          <p className="relative text-lg md:text-xl lg:text-2xl text-white/90 font-light italic tracking-wide">
            &quot;Where Peace, Nature & Love Meet&quot;
          </p>
        </div>

        {/* Decorative Diamond Line */}
        <div className="flex items-center gap-4 mt-8">
          <div className="w-16 md:w-24 h-px bg-linear-to-r from-transparent to-amber-400/70" />
          <div className="w-3 h-3 rotate-45 bg-amber-400/80" />
          <div className="w-16 md:w-24 h-px bg-linear-to-l from-transparent to-amber-400/70" />
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
