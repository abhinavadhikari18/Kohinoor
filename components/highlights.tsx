"use client"

import Image from "next/image"
import { Gem, Home, Utensils, Wine } from "lucide-react"

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
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/30">
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
        <div className="relative mb-12 group">
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
                  <h3 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">
                    {mainHighlight.title}
                  </h3>
                  <p className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent mb-4">
                    {mainHighlight.subtitle}
                  </p>
                  <p className="text-white/80 text-lg max-w-xl">
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
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {semiHighlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="group relative overflow-hidden rounded-2xl shadow-xl premium-hover"
              style={{ animationDelay: `${index * 100}ms` }}
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
