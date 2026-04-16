"use client"

import { useState } from "react"
import Image from "next/image"
import { Utensils, Wine, Coffee, Flame } from "lucide-react"
import type { MenuTabKey, MenuTabs } from "@/lib/menu-types"

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

  return (
    <section id="menu" className="relative overflow-hidden py-20 px-4 bg-gradient-to-b from-[#FDF8F3] to-[#F5EDE6]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.035]">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.PNG-RflDppQJdLrSmpnp64Ad8P8rG1e8KP.jpeg"
            alt="Kohinoor watermark logo"
            fill
            className="object-contain scale-[0.75]"
          />
        </div>
        <div className="absolute left-[8%] top-[12%] w-4 h-4 rotate-45 bg-white animate-sparkle" style={{ opacity: 0.08 }} />
        <div className="absolute right-[14%] top-[22%] w-3 h-3 rotate-45 bg-[#E8A4B8] animate-sparkle" style={{ opacity: 0.08, animationDelay: "0.8s" }} />
        <div className="absolute left-[18%] bottom-[20%] w-2.5 h-2.5 rotate-45 bg-[#F4D9E3] animate-sparkle" style={{ opacity: 0.07, animationDelay: "1.5s" }} />
        <div className="absolute right-[22%] bottom-[14%] w-4 h-4 rotate-45 bg-white animate-sparkle" style={{ opacity: 0.06, animationDelay: "2.2s" }} />
        <div className="absolute left-1/2 top-[10%] w-2 h-2 rotate-45 bg-[#E8A4B8] animate-sparkle" style={{ opacity: 0.08, animationDelay: "1.1s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#E8A4B8]" />
            <Flame className="w-6 h-6 text-[#E8A4B8]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#E8A4B8]" />
          </div>
          <h2 className="menu-font text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Our Menu
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our exquisite selection of dishes and beverages
          </p>
        </div>

        {/* Menu Tabs - Creme Base with Rose-Pink Hover */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/80 rounded-full p-1.5 shadow-lg border border-[#E8D5C4]">
            {uiTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as MenuTabKey)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-[#E8A4B8] text-white shadow-md"
                    : "text-muted-foreground hover:text-[#D4869E] hover:bg-[#F5EDE6]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline menu-font">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeMenu.map((category) => (
            <div
              key={category.name}
              className="bg-white/88 backdrop-blur-[2px] rounded-2xl p-6 shadow-lg premium-hover border border-[#E8D5C4]/50"
            >
              <h3 className="menu-font text-xl font-semibold text-foreground mb-4 pb-3 border-b border-[#E8D5C4] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8A4B8]" />
                {category.name}
              </h3>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-start gap-2">
                    <span className="menu-font text-foreground/80 flex-1">{item.name}</span>
                    <span className="text-[#D4869E] font-semibold whitespace-nowrap desc-font">
                      {item.vegPrice && item.nonVegPrice ? (
                        <span className="text-sm">
                          <span className="text-green-600">V: {item.vegPrice}</span>
                          {" / "}
                          <span className="text-red-600">NV: {item.nonVegPrice}</span>
                        </span>
                      ) : (
                        `Rs ${item.price ?? "-"}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Price Note */}
        <p className="text-center text-muted-foreground text-sm mt-8">
          * All prices are in Nepalese Rupees (NPR). Prices may vary.
        </p>
      </div>
    </section>
  )
}
