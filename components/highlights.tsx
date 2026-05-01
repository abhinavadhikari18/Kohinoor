"use client"

import { useRef } from "react"
import Image from "next/image"
import { Gem, Home, Utensils, Wine } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const mainHighlight = {
  title: "Cozy Room",
  subtitle: "Just Rs 500",
  description: "Experience comfort in our beautifully furnished rooms with all modern amenities. Perfect for a peaceful overnight stay.",
  image: "bedroom1.jpg",
  icon: Home,
}

const semiHighlights = [
  {
    title: "Free Private Cabins",
    description: "Enjoy intimate moments in our complimentary private cabins surrounded by nature.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cabin2-R0016rsTLy5HRs9rNsXLSYOpfvF07k.jpg",
    icon: Gem,
  },
  {
    title: "Famous Sekuwa Corner",
    description: "Savor our signature Sekuwa, grilled to perfection with authentic Nepali spices.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bar-YpqqsjZipzBQzh64D0eHgHZhcLpvIv.jpg",
    icon: Utensils,
  },
  {
    title: "Hookah Bar Lounge",
    description: "Unwind in our stylish hookah bar lounge with cozy seating, warm lights, and a relaxed evening vibe.",
    image: "bar.jpg",
    icon: Wine,
  },
]

export default function Highlights() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
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
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <Gem className="w-6 h-6 text-amber-500" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Highlights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover what makes Kohinoor Restaurant a truly special destination
          </p>
        </div>

        {/* Main Highlight Card */}
        <div className="relative mb-12 group main-highlight-card transform-style-3d">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl premium-hover">
            <div className="relative h-[400px] md:h-[500px]">
              <Image
                src={mainHighlight.image}
                alt={mainHighlight.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex items-start gap-6">
                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg">
                  <mainHighlight.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block px-4 py-1.5 bg-amber-500 text-white text-sm font-semibold rounded-full mb-4">
                    Featured Offer
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                    {mainHighlight.title}
                  </h3>
                  <p className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent mb-4">
                    {mainHighlight.subtitle}
                  </p>
                  <p className="text-white/80 text-base sm:text-lg max-w-xl">
                    {mainHighlight.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Diamond Decoration */}
            <div className="absolute top-6 right-6 w-4 h-4 rotate-45 bg-amber-400/80 animate-sparkle" />
            <div className="absolute top-12 right-12 w-2 h-2 rotate-45 bg-amber-300/60 animate-sparkle delay-300" />
          </div>
        </div>

        {/* Semi Highlights */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10 semi-highlights-container">
          {semiHighlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="group relative overflow-hidden rounded-2xl shadow-xl premium-hover semi-highlight-card transform-style-3d"
            >
              <div className="relative h-[300px]">
                <Image
                  src={highlight.image}
                  alt={highlight.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600">
                    <highlight.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    {highlight.title}
                  </h3>
                </div>
                <p className="text-white/80">
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
