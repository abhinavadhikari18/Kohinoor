"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react"

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const quickLinks = [
  { name: "Home", href: "#home" },
  { name: "Gallery", href: "#gallery" },
  { name: "Menu", href: "#menu" },
  { name: "About Us", href: "#about" },
  { name: "Contact", href: "#contact" },
]

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/people/Kohinoor-Restaurant/61570447280338/", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/kohinoorrestaurant2024?igsh=bWh6NGptN2pvMnN6", label: "Instagram" },
  { icon: TikTokIcon, href: "https://www.tiktok.com/discover/kohinoor-restaurant-butwal", label: "TikTok" },
]

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400/50">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo.PNG-RflDppQJdLrSmpnp64Ad8P8rG1e8KP.jpeg"
                  alt="Kohinoor Restaurant Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-amber-100">Kohinoor</h3>
                <p className="text-sm text-background/60">Restaurant</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Where Peace, Nature & Love Meet. Experience the finest dining in a serene 
              environment with our signature dishes and warm hospitality.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-100 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-background/70 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-100 mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-background/70">+977 9709671703</p>
                  <p className="text-background/70">+977 9812345678</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-background/70 text-sm">kohinoor.restaurant@gmail.com</p>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-background/70 text-sm">Tilottama-13, Kotihawa</p>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-100 mb-6">Opening Hours</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between text-background/70">
                <span>Monday - Friday</span>
                <span>11AM - 10PM</span>
              </li>
              <li className="flex justify-between text-background/70">
                <span>Saturday</span>
                <span>10AM - 11PM</span>
              </li>
              <li className="flex justify-between text-background/70">
                <span>Sunday</span>
                <span>10AM - 11PM</span>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="tel:+9779845628519"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5EDE6] text-[#3D2E24] border-2 border-[#E8D5C4] font-semibold rounded-full text-sm hover:bg-[#E8A4B8] hover:border-[#E8A4B8] hover:text-white hover:shadow-lg hover:shadow-[#E8A4B8]/30 transition-all"
              >
                <Phone className="w-4 h-4" />
                Reserve Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Kohinoor Restaurant. All rights reserved.
            </p>
            <p className="text-background/50 text-sm">
              Crafted by{" "}
              <Link
                href="https://nine-sapphires9.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                NineSapphires
              </Link>
              {" "}by Ab.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
