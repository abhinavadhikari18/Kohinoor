"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import type { GalleryImage } from "@/lib/gallery-types"

export interface GalleryProps {
  images: GalleryImage[]
}

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

  return (
    <section id="gallery" className="py-20 px-4 bg-[#F5EDE6]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#E8A4B8]" />
            <Camera className="w-6 h-6 text-[#E8A4B8]" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#E8A4B8]" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Gallery
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take a visual journey through Kohinoor Restaurant
          </p>
        </div>

        {/* Gallery Grid - Natural masonry flow */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 [column-gap:1.25rem]">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`group relative mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] cursor-pointer premium-hover shadow-lg border border-white/50 ${
                image.size === "large"
                  ? "ring-1 ring-[#E8D5C4]/80"
                  : image.size === "medium"
                    ? "ring-1 ring-[#F5EDE6]/80"
                    : ""
              }`}
              onClick={() => openLightbox(index)}
            >
              <div className="relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]"
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
                  <div className="w-14 h-14 rounded-full bg-[#E8A4B8]/80 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 lightbox-overlay flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-8 h-8 text-white" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Image Container */}
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full">
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              className="object-contain"
            />
          </div>

          {/* Description */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium mb-2 menu-font">
              {images[currentIndex].alt}
            </p>
              <p className="text-white/70 text-sm desc-font">
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
