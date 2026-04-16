"use client"

import { useState, useEffect } from "react"
import { Phone, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

          {/* Call Now Button - Creme Base with Rose-Pink Hover */}
          <div className="hidden md:block">
            <a
              href="tel:+9779709671703"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5EDE6] text-[#3D2E24] border-2 border-[#E8D5C4] font-semibold rounded-full shadow-md hover:bg-[#E8A4B8] hover:border-[#E8A4B8] hover:text-white hover:shadow-[#E8A4B8]/30 hover:scale-105 transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "text-foreground" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 glass shadow-xl transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left text-foreground font-medium py-2 hover:text-amber-600 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <a
            href="tel:+9779709671703"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5EDE6] text-[#3D2E24] border-2 border-[#E8D5C4] font-semibold rounded-full shadow-md hover:bg-[#E8A4B8] hover:border-[#E8A4B8] hover:text-white transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </div>
    </nav>
  )
}
