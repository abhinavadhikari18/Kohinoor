"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Utensils, Wine, Coffee, Flame } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { MenuTabKey, MenuTabs } from "@/lib/menu-types"
import { VegIcon, NonVegIcon } from "@/components/veg-non-veg-icons"
import { RelaxingIcon } from "./relaxing-icon"

export interface MenuSectionProps {
  tabs: MenuTabs
}

const uiTabs = [
  { id: "food", label: "Food Menu", icon: Utensils },
  { id: "bar", label: "Bar Menu", icon: Wine },
  { id: "beverages", label: "Beverages", icon: Coffee },
]

export default function MenuSection({ tabs }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState<MenuTabKey>("food")
  const activeMenu = tabs[activeTab]
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.fromTo(".menu-category",
      {
        y: 50,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".menu-container",
          start: "top 80%",
        }
      }
    )

    // Watermark Parallax
    gsap.to(".menu-watermark", {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    })
  }, { scope: sectionRef, dependencies: [activeTab] })

  useGSAP(() => {
    // 3D Tilt for menu categories
    const cards = gsap.utils.toArray<HTMLElement>(".tilt-card")
    cards.forEach((card) => {
      const handleMouseMove = (e: MouseEvent) => {
        // Don't run on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return

        const { left, top, width, height } = card.getBoundingClientRect()
        const x = (e.clientX - left) / width - 0.5
        const y = (e.clientY - top) / height - 0.5
        
        gsap.to(card, {
          rotateX: -y * 10,
          rotateY: x * 10,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.5
        })

        const inner = card.querySelector(".tilt-inner")
        if (inner) {
          gsap.to(inner, {
            x: x * 10,
            y: y * 10,
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
  }, { scope: sectionRef, dependencies: [activeTab] })

  return (
    <section ref={sectionRef} id="menu" className="relative overflow-hidden py-24 px-4 bg-[#FDF8F3] dark:bg-background">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.02] menu-watermark">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.PNG-RflDppQJdLrSmpnp64Ad8P8rG1e8KP.jpeg"
            alt="Kohinoor watermark logo"
            fill
            className="object-contain scale-[0.8]"
          />
        </div>

        {/* Soft Glows */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-rose-pink/5 rounded-full blur-[120px]" />

        {/* Sparkles */}
        <div className="absolute left-[5%] top-[15%] w-3 h-3 rotate-45 bg-gold/20 animate-sparkle" />
        <div className="absolute right-[8%] top-[25%] w-2 h-2 rotate-45 bg-primary/10 animate-sparkle" style={{ animationDelay: "1s" }} />
        <div className="absolute left-[12%] bottom-[20%] w-2.5 h-2.5 rotate-45 bg-rose-pink/10 animate-sparkle" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <Flame className="w-6 h-6 text-primary/60" />
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
          <h2 className="menu-font text-5xl md:text-6xl font-semibold text-foreground mb-6 tracking-tight">
            Our Menu
          </h2>
          <p className="desc-font text-muted-foreground text-lg max-w-2xl mx-auto font-light tracking-wide">
            A symphony of flavors crafted with passion and tradition.
          </p>
        </div>

        {/* Menu Tabs */}
        <div className="flex justify-start sm:justify-center mb-16 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          <div className="inline-flex bg-white/40 dark:bg-card/40 backdrop-blur-xl rounded-full p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-white/20 dark:border-border/40 min-w-max">
            {uiTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MenuTabKey)}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-full font-medium transition-all duration-500 group/tab ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(61,46,36,0.2)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-secondary/40"
                }`}
              >
                <div className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-500 ${
                  activeTab === tab.id ? "bg-white/20 scale-110" : "bg-transparent group-hover/tab:bg-white/40 dark:group-hover/tab:bg-white/5"
                }`}>
                  <tab.icon className={`w-4 h-4 transition-all duration-500 ${activeTab === tab.id ? "animate-float-slow text-white" : ""}`} />
                </div>
                <span className="menu-font tracking-wide">{tab.label}</span>
              </button>
            ))}

          </div>
        </div>

        {/* Menu Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 menu-container">
          {activeMenu.map((category) => (
            <div
              key={category.name}
              className="menu-category group bg-card/60 dark:bg-card/40 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform-style-3d tilt-card interactive-touch"
            >
              <div className="tilt-inner transform-style-3d h-full">
                <h3 className="menu-font text-2xl font-semibold text-foreground mb-6 pb-4 border-b border-border/50 flex items-center justify-between translate-z-50">
                  <span>{category.name}</span>
                  <span className="w-8 h-px bg-primary/30 group-hover:w-12 transition-all duration-500" />
                </h3>
                <div className="space-y-6 transform-style-3d">
                  {category.items.map((item) => (
                    <div key={item.name} className="group/item transform-style-3d translate-z-20">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 sm:gap-2">
                        <span className="menu-font text-[17px] text-foreground/90 group-hover/item:text-primary transition-colors duration-300">
                          {item.name}
                        </span>
                        <div className="hidden sm:block flex-1 border-b border-dotted border-foreground/20 mx-2 mb-1" />
                        <span className="text-primary font-bold whitespace-nowrap desc-font text-lg translate-z-10 flex sm:block items-center justify-between">
                          <span className="sm:hidden text-xs text-muted-foreground font-normal uppercase tracking-widest mr-2">Price</span>
                          {item.vegPrice && item.nonVegPrice ? (
                            <div className="flex items-center sm:items-end leading-tight gap-3 sm:gap-0">
                              <span className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5">
                                  <VegIcon />
                                  <span className="text-green-600 dark:text-green-500">{item.vegPrice}</span>
                                </span>
                                <span className="text-foreground/20 font-light">|</span>
                                <span className="flex items-center gap-1.5">
                                  <NonVegIcon />
                                  <span className="text-red-600 dark:text-red-500">{item.nonVegPrice}</span>
                                </span>
                              </span>
                            </div>
                          ) : (
                            `Rs ${item.price ?? "-"}`
                          )}
                        </span>
                      </div>
                      {item.description ? (
                        <p className="text-sm text-muted-foreground mt-1.5 desc-font font-light leading-relaxed max-w-[95%] sm:max-w-[85%]">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Note */}
        <div className="mt-16 text-center">
          <p className="inline-block px-6 py-2 rounded-full bg-secondary/50 dark:bg-secondary/20 text-muted-foreground text-sm desc-font font-light">
            * All prices are in Nepalese Rupees (NPR). Subject to applicable taxes.
          </p>
        </div>
      </div>
    </section>
  )
}
