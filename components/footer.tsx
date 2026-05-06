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
    <footer className="bg-foreground text-background dark:bg-black dark:text-white">
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
                <p className="text-sm text-white/60">Restaurant</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
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
                  className="group/social relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-all duration-300 hover:-translate-y-1"
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full opacity-0 group-hover/social:opacity-100 transition-opacity" />
                  <social.icon className="w-5 h-5 relative z-10 group-hover/social:animate-float-slow" />
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
                    className="text-white/70 hover:text-amber-400 transition-colors text-sm"
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
              <li className="flex items-start gap-3 group/item">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/20 blur-sm rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  <Phone className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 relative z-10 group-hover/item:animate-float-slow" />
                </div>
                <div className="text-sm">
                  <p className="text-white/70">+977 9715233533</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group/item">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/20 blur-sm rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 relative z-10 group-hover/item:animate-float-slow" />
                </div>
                <p className="text-white/70 text-sm">restaurantkohinoor11@gmail.com</p>
              </li>
              <li className="flex items-start gap-3 group/item">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400/20 blur-sm rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity" />
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 relative z-10 group-hover/item:animate-float-slow" />
                </div>
                <p className="text-white/70 text-sm">Tilottama-13, Kotihawa</p>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg font-bold text-amber-100 mb-6">Opening Hours</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between text-white/70">
                <span>Sunday - Saturday</span>
                <span>10AM - 10PM</span>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="tel:+9779715233533"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-background text-foreground border-2 border-border font-semibold rounded-full text-sm hover:bg-primary hover:border-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all dark:bg-secondary dark:text-secondary-foreground"
              >
                <Phone className="w-4 h-4" />
                Reserve Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Kohinoor Restaurant. All rights reserved.
            </p>
            <p className="text-white/50 text-sm">
              Crafted by{" "}
              <Link
                href="https://nine-sapphires9.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                NineSapphires
              </Link>
              {" "}by Ab & backend/ux by{" "}
              <Link
                href="https://sagarb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                Sagar
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
