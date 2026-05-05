"use client"

import { Home, Utensils, Phone, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"

const navItems = [
  { name: "Home", icon: Home, href: "#home" },
  { name: "Menu", icon: Utensils, href: "#menu" },
  { name: "Call", icon: Phone, href: "tel:+9779715233533" },
  { name: "Contact", icon: MessageSquare, href: "#contact" },
]

export default function MobileBottomBar() {
  const [activeSection, setActiveSection] = useState("home")
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      // Hide on scroll down, show on scroll up
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      setLastScrollY(currentScrollY)

      // Update active section
      const sections = ["home", "menu", "contact"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <div 
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md md:hidden transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      }`}
    >
      <nav className="bg-background/80 backdrop-blur-xl border border-amber-400/20 rounded-full shadow-[0_8px_32px_rgba(212,184,150,0.15)] p-2 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = item.href === `#${activeSection}` || (activeSection === "home" && item.href === "#home")
          const isExternal = !item.href.startsWith("#")
          
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={`flex flex-col items-center gap-1 flex-1 py-2 px-1 rounded-full transition-all duration-300 active:scale-90 ${
                isActive 
                  ? "text-amber-600 bg-amber-500/10" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}
