import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Highlights from "@/components/highlights"
import Gallery from "@/components/gallery"
import MenuSection from "@/components/menu-section"
import About from "@/components/about"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import SparklingDiamonds from "@/components/sparkling-diamonds"
import { getGalleryData, getMenuData } from "@/lib/content"

export const dynamic = "force-dynamic"

export default async function Home() {
  const [menuData, galleryData] = await Promise.all([getMenuData(), getGalleryData()])

  return (
    <main className="min-h-screen relative">
      {/* Subtle sparkling diamond accents */}
      <SparklingDiamonds />
      
      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Highlights />
        <Gallery images={galleryData.images} />
        <MenuSection tabs={menuData.tabs} />
        <About />
        <Contact />
        <Footer />
      </div>
    </main>
  )
}
