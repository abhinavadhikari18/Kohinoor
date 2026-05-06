"use client"

import { useRef } from "react"
import Image from "next/image"
import { Gem, Home, UtensilsCrossed, Wine, Sparkles, BedDouble, Flame, Crown, Martini } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { RelaxingIcon } from "./relaxing-icon"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const mainHighlight = {
  title: "Cozy Room",
  subtitle: "Just Rs 500",
  description: "Experience comfort in our beautifully furnished rooms with all modern amenities. Perfect for a peaceful overnight stay.",
  image: "bedroom1.jpg",
  icon: BedDouble,
}

const semiHighlights = [
  {
    title: "Free Private Cabins",
    description: "Enjoy intimate moments in our complimentary private cabins surrounded by nature.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cabin2-R0016rsTLy5HRs9rNsXLSYOpfvF07k.jpg",
    icon: Crown,
  },
  {
    title: "Famous Sekuwa Corner",
    description: "Savor our signature Sekuwa, grilled to perfection with authentic Nepali spices.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bar-YpqqsjZipzBQzh64D0eHgHZhcLpvIv.jpg",
    icon: Flame,
  },
  {
    title: "Hookah Bar Lounge",
    description: "Unwind in our stylish hookah bar lounge with cozy seating and a relaxed evening vibe.",
    image: "bar.jpg",
    icon: Martini,
  },
]

export default function Highlights() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".tilt-card")
    
    cards.forEach((card) => {
      const handleMouseMove = (e: MouseEvent) => {
        // Don't run on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return

        const { left, top, width, height } = card.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5
        
        gsap.to(card, {
          rotateX: -y * 20,
          rotateY: x * 20,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.5
        })

        // Inner content parallax
        const inner = card.querySelector(".tilt-inner")
        if (inner) {
          gsap.to(inner, {
            x: x * 20,
            y: y * 20,
            ease: "power2.out",
            duration: 0.5
          })
        }
      }

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          ease: "power3.out",
          duration: 1
        })
        const inner = card.querySelector(".tilt-inner")
        if (inner) {
          gsap.to(inner, {
            x: 0,
            y: 0,
            ease: "power3.out",
            duration: 1
          })
        }
      }

      card.addEventListener("mousemove", handleMouseMove)
      card.addEventListener("mouseleave", handleMouseLeave)
    })

    // 3D pop-in effect for main highlight
    gsap.fromTo(".main-highlight-card", 
      { 
        y: 100, 
        opacity: 0, 
        rotateX: -30, 
        transformPerspective: 1000 
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".main-highlight-card",
          start: "top 95%", // Adjusted for mobile
        }
      }
    )

    // Staggered 3D pop-in for semi-highlights
    gsap.fromTo(".semi-highlight-card",
      { 
        y: 80, 
        opacity: 0, 
        rotateY: 30, 
        transformPerspective: 1000 
      },
      {
        y: 0,
        opacity: 1,
        rotateY: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".semi-highlights-container",
          start: "top 95%", // Adjusted for mobile
        }
      }
    )

    // Image Parallax Effects
    gsap.to(".main-highlight-parallax", {
      y: 60,
      ease: "none",
      scrollTrigger: {
        trigger: ".main-highlight-card",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })

    gsap.to(".semi-highlight-parallax", {
      y: 40,
      ease: "none",
      scrollTrigger: {
        trigger: ".semi-highlights-container",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <div className="relative">
              <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full animate-pulse" />
              <Gem className="w-6 h-6 text-amber-500 relative z-10 animate-float-slow" />
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our Highlights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what makes Kohinoor Restaurant a truly special destination
          </p>
        </div>

        {/* Main Highlight Card */}
        <div className="relative mb-12 group main-highlight-card transform-style-3d tilt-card interactive-touch">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl premium-hover transform-style-3d">
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src={mainHighlight.image}
                alt={mainHighlight.title}
                fill
                className="object-cover main-highlight-parallax scale-110 transition-transform duration-700 group-hover:scale-115"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-8 pb-6 pt-12 md:px-12 md:pb-8 md:pt-16 tilt-inner transform-style-3d">
              <div className="flex items-start gap-6 transform-style-3d">
                <div className="hidden md:block">
                  <RelaxingIcon 
                    icon={mainHighlight.icon} 
                    containerClassName="scale-125" 
                    className="w-6 h-6"
                  />
                </div>
                <div className="flex-1 transform-style-3d">
                  <div className="inline-block px-4 py-1.5 bg-amber-500 text-white text-sm font-semibold rounded-full mb-4 translate-z-50">
                    Featured Offer
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 leading-tight translate-z-50">
                    {mainHighlight.title}
                  </h3>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent mb-3 translate-z-50">
                    {mainHighlight.subtitle}
                  </p>
                  <p className="text-white/80 text-sm sm:text-base max-w-xl translate-z-20">
                    {mainHighlight.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Diamond Decoration */}
            <div className="absolute top-6 right-6 w-4 h-4 rotate-45 bg-amber-400/80 animate-sparkle translate-z-50" />
            <div className="absolute top-12 right-12 w-2 h-2 rotate-45 bg-amber-300/60 animate-sparkle delay-300 translate-z-20" />
          </div>
        </div>

        {/* Semi Highlights */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 semi-highlights-container">
          {semiHighlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="group relative overflow-hidden rounded-2xl shadow-xl premium-hover semi-highlight-card transform-style-3d tilt-card interactive-touch"
            >
              <div className="relative h-[300px]">
                <Image
                  src={highlight.image}
                  alt={highlight.title}
                  fill
                  className="object-cover semi-highlight-parallax scale-110 transition-transform duration-700 group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 pt-10 tilt-inner transform-style-3d">
                <div className="flex items-center gap-3 mb-2 transform-style-3d">
                  <RelaxingIcon icon={highlight.icon} />
                  <h3 className="font-serif text-xl font-bold text-white leading-tight translate-z-50">
                    {highlight.title}
                  </h3>
                </div>
                <p className="text-white/80 text-sm leading-relaxed translate-z-20">
                  {highlight.description}
                </p>
              </div>

              {/* Shimmer Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
