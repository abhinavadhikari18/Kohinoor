"use client"

import Image from "next/image"
import { Home, Gem, Utensils, TreePine, Ship, Heart, MapPin } from "lucide-react"

const features = [
  {
    icon: Home,
    title: "Cozy Rooms",
    description: "Comfortable rooms starting at just Rs 500 for a peaceful overnight stay.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bedroom1-jWqxDbDWEIRo6VCC7dYB24PnPtZeeE.jpg",
  },
  {
    icon: Gem,
    title: "Private Cabins",
    description: "Complimentary private cabins perfect for intimate dining experiences.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cabin2-R0016rsTLy5HRs9rNsXLSYOpfvF07k.jpg",
  },
  {
    icon: Utensils,
    title: "Famous Sekuwa",
    description: "Our signature Sekuwa grilled with authentic Nepali spices and flavors.",
    image: "sekuwa.jpg",
  },
  {
    icon: TreePine,
    title: "Nature Friendly",
    description: "Surrounded by lush greenery for a peaceful, natural ambiance.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/peace%20ambience-iLfDxor9pBjoyyqYwv3Wubuh4UZY1p.jpg",
  },
  {
    icon: Ship,
    title: "Lake & Boating",
    description: "Enjoy our serene lake with boating facilities available.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boat%20scene-QgqqN8CTMX9ompWDEEQZblUFaCFjx9.jpg",
  },

  {
    icon: Heart,
    title: "Hookah Bar Lounge",
    description: "Elevate your evening with our premium hookah experience.",
    image: "bar.jpg",
  },
]

export default function About() {
  return (
    <section id="about" className="py-20 px-4 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
            <Heart className="w-6 h-6 text-amber-500" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Kohinoor
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Where culinary excellence meets natural serenity
          </p>
        </div>

        {/* Main About Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image Side */}
          <div className="relative">
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exterior%20entry-D2HBq4n2aW39dW8YEXYz5jkfr2Ijj6.jpg"
                alt="Kohinoor Restaurant"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-card p-6 rounded-2xl shadow-xl max-w-[200px]">
              <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                2+
              </div>
              <p className="text-muted-foreground text-sm mt-1">Years of Excellence</p>
            </div>
          </div>

          {/* Text Side */}
          <div>
            <h3 className="font-serif text-3xl font-bold text-foreground mb-6">
              A Diamond in Culinary Excellence
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welcome to <span className="text-amber-600 font-semibold">Kohinoor Restaurant</span>, 
                a gem nestled in nature&apos;s embrace. Named after the legendary diamond, we strive to 
                offer an experience that&apos;s equally precious and unforgettable.
              </p>
              <p>
                Our establishment combines the warmth of traditional Nepali hospitality with modern 
                comforts. Whether you&apos;re seeking a romantic dinner in our private cabins, a family 
                gathering by the lake, or simply a peaceful escape from the city, Kohinoor offers 
                the perfect setting.
              </p>
              <p>
                From our famous Sekuwa corner to cozy overnight rooms, from boating on our 
                serene lake to hookah lounges under the stars - every moment at Kohinoor is crafted 
                to create lasting memories.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-card rounded-xl">
                <div className="text-2xl font-bold text-amber-600">9</div>
                <div className="text-sm text-muted-foreground">Cozy Rooms</div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl">
                <div className="text-2xl font-bold text-amber-600">11</div>
                <div className="text-sm text-muted-foreground">Private Cabins</div>
              </div>
              <div className="text-center p-4 bg-card rounded-xl">
                <div className="text-2xl font-bold text-amber-600">50+</div>
                <div className="text-sm text-muted-foreground">Menu Items</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-lg premium-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {feature.title}
                  </h4>
                </div>
                <p className="text-white/80 text-sm">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Google Maps */}
        <div className="mt-16">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2 text-center">
            Find Us Here
          </h3>
          <p className="text-center text-muted-foreground mb-6">Tilottama-13, Kotihawa</p>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.0!2d83.4551!3d27.6828!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39969b001b58b04b%3A0xc5c3a1ce0aabc65b!2sKohinoor%20Restaurant!5e0!3m2!1sen!2snp!4v1704067890123"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kohinoor Restaurant - Tilottama-13, Kotihawa"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://maps.google.com/?q=Kohinoor+Restaurant+Tilottama+Kotihawa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
