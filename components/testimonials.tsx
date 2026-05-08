"use client"

import { useRef } from "react"
import { Quote, Star } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePerformance } from "./performance-provider"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    name: "Dilip BK",
    text: "The Rs 500 room was clean and cozy, definitely the cheapest and most affordable stay I’ve found. The romantic private cabins made it feel like the best romantic restaurant for couples. Food was excellent, especially the sekuwa, and the boating added a peaceful touch for families.",
    role: "Happy Customer",
    rating: 5,
  },
  {
    name: "Sudan Gyawali",
    text: "This place is ideal for both couples and families. The private cabins give a romantic vibe, while the garden and boating are peaceful for everyone. The Rs 500 room is the cheapest option yet comfortable, and the sekuwa is simply the best.",
    role: "Local Guide",
    rating: 5,
  },
  {
    name: "Rahul Sharma",
    text: "Sathi haru sanga gako, Sekuwa was ekdam delicious! Private cabin vibes are something else. 500 ma room paunu is a real deal. Best place to chill.",
    role: "Frequent Visitor",
    rating: 5,
  },
  {
    name: "Anjali Thapa",
    text: "Family party ko lagi perfect thau. Boating garera kids were so happy. Peaceful environment, Bhairahawa ma esto aru thau chaina hola. Highly recommended!",
    role: "Family Guest",
    rating: 4,
  },
  {
    name: "Sameer & Neha",
    text: "Best romantic date! Privacy ekdam ramro cha cabin ma. Lakeside view and music made our anniversary truly special. Food quality is top-notch. Love from Butwal.",
    role: "Couple",
    rating: 5,
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isLowEnd } = usePerformance()

  useGSAP(() => {
    if (isLowEnd) return

    gsap.fromTo(".testimonial-header",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".testimonial-header",
          start: "top 90%",
        }
      }
    )

    gsap.fromTo(".testimonial-card",
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".testimonial-grid",
          start: "top 85%",
        }
      }
    )
  }, { scope: sectionRef, dependencies: [isLowEnd] })

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 testimonial-header">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <Quote className="w-6 h-6 text-amber-500 animate-float-slow" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Our Guests Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Genuine experiences from our beloved visitors at Kohinoor
          </p>
        </div>

        {/* Testimonials Carousel for Mobile, Grid for Desktop */}
        <div className="testimonial-grid">
          <div className="hidden lg:grid grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((item, idx) => (
              <TestimonialCard key={idx} {...item} />
            ))}
            <div className="col-span-3 grid grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.slice(3).map((item, idx) => (
                <TestimonialCard key={idx} {...item} />
              ))}
            </div>
          </div>

          <div className="lg:hidden">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-sm mx-auto sm:max-w-md md:max-w-lg"
            >
              <CarouselContent>
                {testimonials.map((item, idx) => (
                  <CarouselItem key={idx}>
                    <div className="p-1">
                      <TestimonialCard {...item} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-8">
                <CarouselPrevious className="relative translate-y-0 left-0" />
                <CarouselNext className="relative translate-y-0 right-0" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ name, text, role, rating }: { name: string, text: string, role: string, rating: number }) {
  const { isLowEnd } = usePerformance()
  
  return (
    <div className={`testimonial-card h-full bg-card p-8 rounded-[2rem] border border-border/50 shadow-xl flex flex-col justify-between relative overflow-hidden ${!isLowEnd ? 'premium-hover' : ''}`}>
      {/* Decorative Quote Icon */}
      <div className="absolute -top-4 -right-4 opacity-5">
        <Quote className="w-24 h-24 rotate-180" />
      </div>

      <div>
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} 
            />
          ))}
        </div>
        <p className="text-muted-foreground italic leading-relaxed mb-6 italic">
          &quot;{text}&quot;
        </p>
      </div>

      <div className="flex items-center gap-4 border-t border-border/30 pt-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-foreground">{name}</h4>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{role}</p>
        </div>
      </div>
    </div>
  )
}
