"use client"

import { useState } from "react"
import { Phone, Mail, MapPin, Send, Facebook, Instagram, Clock, Heart } from "lucide-react"
import Image from "next/image"

// TikTok icon component since lucide doesn't have it
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+977 9709671703",
    href: "tel:+9779709671703",
  },
  {
    icon: Phone,
    label: "Alternate",
    value: "+977 9812345678",
    href: "tel:+9779812345678",
  },
  {
    icon: Mail,
    label: "Email",
    value: "kohinoor.restaurant@gmail.com",
    href: "mailto:kohinoor.restaurant@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Tilottama-13, Kotihawa",
    href: "https://maps.google.com/?q=Kohinoor+Restaurant+Tilottama+Kotihawa",
  },
]

const socialLinks = [
  {
    icon: Facebook,
    label: "Facebook",
    handle: "@kohinoorrestaurant",
    href: "https://www.facebook.com/people/Kohinoor-Restaurant/61570447280338/",
    color: "hover:bg-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@kohinoor_restaurant",
    href: "https://instagram.com/kohinoor_restaurant",
    color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: TikTokIcon,
    label: "TikTok",
    handle: "@kohinoor.restaurant",
    href: "https://www.tiktok.com/discover/kohinoor-restaurant-butwal",
    color: "hover:bg-black",
    bgColor: "bg-gray-500/10",
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Open Instagram DM with the message
    try {
      // Create the message to send via Instagram
      const instagramMessage = encodeURIComponent(
        `New inquiry from ${formData.name}\nEmail: ${formData.email}\n\nMessage: ${formData.message}`
      )
      
      // Open Instagram with pre-filled message (this will open the Instagram app/web)
      window.open(
        `https://ig.me/m/kohinoor_restaurant?text=${instagramMessage}`,
        '_blank'
      )
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus("success")
      setFormData({ name: "", email: "", message: "" })
    } catch {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus("idle"), 3000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section 
      id="contact" 
      className="py-20 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(248, 244, 232, 0.98) 0%, rgba(252, 231, 243, 0.95) 50%, rgba(248, 244, 232, 0.98) 100%)"
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-pink-400 to-amber-400" />
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-pink-400 to-amber-400" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Get In Touch
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;d love to hear from you. Reach out for reservations or inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info Side */}
          <div>
            {/* Image */}
            <div className="relative h-[250px] rounded-2xl overflow-hidden shadow-xl mb-8 border-4 border-white/50">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kohinoor%20swing-z0vmquldtvGjN8WG8gP0OwV5hQ0pZq.jpg"
                alt="Kohinoor Restaurant"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="font-serif text-2xl font-bold text-white">
                  Visit Us Today
                </h3>
                <p className="text-white/80">Experience the magic of Kohinoor</p>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {contactInfo.map((info) => (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-md premium-hover border border-pink-100"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-amber-400">
                    <info.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-pink-600">{info.label}</p>
                    <p className="font-medium text-foreground">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Opening Hours */}
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md mb-8 border border-pink-100">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-pink-500" />
                <h4 className="font-serif text-lg font-bold text-foreground">Opening Hours</h4>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium text-foreground">11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday - Sunday</span>
                  <span className="font-medium text-foreground">10:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-pink-100">
              <h4 className="font-serif text-lg font-bold text-foreground mb-4">Follow Us</h4>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-4 p-3 rounded-xl ${social.bgColor} transition-all duration-300 hover:scale-[1.02] group`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white text-gray-700 transition-all duration-300 ${social.color} group-hover:text-white`}>
                      <social.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{social.label}</p>
                      <p className="text-sm text-muted-foreground">{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-pink-100">
            <div className="flex items-center gap-3 mb-6">
              <Send className="w-6 h-6 text-pink-500" />
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Send Us a Message
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Your message will be delivered to our Instagram. We&apos;ll get back to you soon!
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Your Name <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Gmail Address <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  pattern="[a-zA-Z0-9._%+-]+@gmail\.com$"
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
                  placeholder="Enter your Gmail address"
                />
                <p className="text-xs text-pink-500 mt-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Please use a valid Gmail address
                </p>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Your Message <span className="text-pink-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#F5EDE6] text-[#3D2E24] border-2 border-[#E8D5C4] font-semibold rounded-xl shadow-md hover:bg-[#E8A4B8] hover:border-[#E8A4B8] hover:text-white hover:shadow-[#E8A4B8]/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending to Instagram...
                  </>
                ) : (
                  <>
                    <Instagram className="w-5 h-5" />
                    Send via Instagram
                  </>
                )}
              </button>
              
              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="p-4 bg-green-100 text-green-700 rounded-xl text-center border border-green-200">
                  Thank you! Instagram is opening with your message.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="p-4 bg-red-100 text-red-700 rounded-xl text-center border border-red-200">
                  Something went wrong. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
