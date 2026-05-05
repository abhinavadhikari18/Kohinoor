"use client"

import { useState, useEffect } from "react"
import { Phone, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import MagneticButton from "./magnetic-button"
import { ThemeToggle } from "./theme-toggle"

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Gallery", href: "#gallery" },
  { name: "Menu", href: "#menu" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-amber-400/50 group-hover:border-amber-400 transition-colors duration-300">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.PNG-RflDppQJdLrSmpnp64Ad8P8rG1e8KP.jpeg"
                alt="Kohinoor Restaurant Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className={`font-serif text-xl font-bold tracking-wide transition-colors duration-300 ${
              isScrolled ? "text-foreground" : "text-white"
            }`}>
              Kohinoor
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`underline-animation font-medium tracking-wide transition-colors duration-300 ${
                  isScrolled
                    ? "text-foreground hover:text-amber-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Actions (Toggle + Call Now) */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <MagneticButton>
              <a
                href="tel:+9779715233533"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground border-2 border-border font-semibold rounded-full shadow-md hover:bg-primary hover:border-primary hover:text-primary-foreground hover:shadow-primary/30 hover:scale-105 transition-all duration-300 interactive"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className={`md:hidden relative z-[60] p-2 rounded-lg transition-colors ${
              isScrolled || isMobileMenuOpen ? "text-foreground bg-background/80" : "text-white bg-black/20"
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-navigation"
        className={`md:hidden fixed left-0 right-0 top-[72px] z-50 border-t border-border bg-background/95 shadow-xl backdrop-blur-xl transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen
            ? "max-h-[calc(100dvh-72px)] opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-4 max-h-[calc(100dvh-72px)] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="font-medium text-foreground">Theme</span>
            <ThemeToggle />
          </div>
          <div className="space-y-2 pt-2">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={`block w-full text-left text-foreground font-medium py-3 hover:text-amber-600 transition-all duration-500 transform ${
                  isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${0.1 * index}s` }}
              >
                {link.name}
              </button>
            ))}
          </div>
          <a
            href="tel:+9779715233533"
            className={`mt-6 flex items-center justify-center gap-2 w-full px-5 py-4 bg-secondary text-secondary-foreground border-2 border-border font-semibold rounded-full shadow-md hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-500 transform ${
              isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${0.1 * navLinks.length}s` }}
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </div>
    </nav>
  )
}
