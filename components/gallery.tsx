"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery-types"

export interface GalleryProps {
  images: GalleryImage[]
}

const gallerySizeClasses: Record<NonNullable<GalleryImage["size"]>, string> = {
  small: "sm:col-span-1 lg:col-span-1 min-h-[230px] sm:min-h-[250px] lg:min-h-[270px]",
  medium: "sm:col-span-1 lg:col-span-2 min-h-[300px] sm:min-h-[320px] lg:min-h-[350px]",
  large: "sm:col-span-2 lg:col-span-2 min-h-[390px] sm:min-h-[430px] lg:min-h-[500px]",
}

const getGallerySize = (size?: GalleryImage["size"]) => size ?? "medium"

export default function Gallery({ images }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "auto"
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, images.length])

  return (
    <section id="gallery" className="py-20 px-4 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary" />
            <Camera className="w-6 h-6 text-primary" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Gallery
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take a visual journey through Kohinoor Restaurant
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid auto-rows-auto grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => {
            const size = getGallerySize(image.size)

            return (
              <button
                key={image.id}
                type="button"
                aria-label={`Open ${image.alt} in gallery`}
                className={`group relative overflow-hidden rounded-[1.75rem] cursor-pointer premium-hover shadow-lg border border-border/50 text-left ${gallerySizeClasses[size]}`}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Description Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-base font-semibold menu-font mb-1 line-clamp-1">{image.alt}</p>
                  <p className="text-white text-sm font-medium line-clamp-2 desc-font">
                    {image.description}
                  </p>
                </div>

                {/* Hover Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 lightbox-overlay flex items-center justify-center p-4" onClick={closeLightbox}>
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Image Container */}
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full flex items-center justify-center" onClick={closeLightbox}>
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="max-w-full max-h-full object-contain cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Description */}
          <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
            <p className="text-white text-lg font-medium mb-2 menu-font">
              {images[currentIndex].alt}
            </p>
            <p className="text-white/70 text-sm desc-font max-w-2xl mx-auto">
              {images[currentIndex].description}
            </p>
            <p className="text-white/50 text-xs mt-2">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
