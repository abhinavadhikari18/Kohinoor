"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import MagneticButton from "@/components/magnetic-button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { GalleryData, GalleryImage } from "@/lib/gallery-types"
import type { MenuCategory, MenuData, MenuItem, MenuTabKey, MenuTabs } from "@/lib/menu-types"
import { toast } from "sonner"

const TAB_LABELS: Record<MenuTabKey, string> = {
  food: "Food Menu",
  bar: "Bar Menu", 
  beverages: "Beverages",
}

const emptyMenuItem = (): MenuItem => ({
  name: "",
  description: "",
  price: "",
})

const emptyMenuCategory = (): MenuCategory => ({
  name: "",
  items: [emptyMenuItem()],
})

const emptyGalleryImage = (): GalleryImage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  src: "",
  alt: "",
  description: "",
  size: "medium",
})

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [activeSection, setActiveSection] = useState<"menu" | "gallery" | null>(null)
  const [isSavingMenu, setIsSavingMenu] = useState(false)
  const [isSavingGallery, setIsSavingGallery] = useState(false)
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({})
  const [menuSearch, setMenuSearch] = useState("")
  const [dragOverId, setDragOverId] = useState<string | null>(null)
  const [dirtyMenuItems, setDirtyMenuItems] = useState<Record<string, boolean>>({})
  const [dirtyGalleryItems, setDirtyGalleryItems] = useState<Record<string, boolean>>({})
  const dragIndexRef = useRef<number | null>(null)
  const quickUploadRef = useRef<HTMLInputElement | null>(null)

  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null)

  const canUseEditor = authed === true

  const fetchSession = async () => {
    const res = await fetch("/api/admin/session", { credentials: "include" })
    if (!res.ok) throw new Error("Failed to check session")
    const data = (await res.json()) as { authed: boolean }
    setAuthed(data.authed)
    return data.authed
  }

  const loadEditors = async () => {
    const loadingId = toast.loading("Loading data...")

    const [menuRes, galleryRes] = await Promise.all([
      fetch("/api/admin/menu", { credentials: "include" }),
      fetch("/api/admin/gallery", { credentials: "include" }),
    ])

    if (!menuRes.ok) throw new Error("Failed to load menu")
    if (!galleryRes.ok) throw new Error("Failed to load gallery")

    const menuData = (await menuRes.json()) as MenuData
    const galleryData = (await galleryRes.json()) as GalleryData

    setMenuData(menuData)
    setGalleryData(galleryData)
    toast.dismiss(loadingId)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const ok = await fetchSession()
        if (ok) await loadEditors()
      } catch (e) {
        setAuthed(false)
        toast.error(e instanceof Error ? e.message : "Failed to load admin page")
      } finally {
        setCheckingSession(false)
      }
    })()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const loadingId = toast.loading("Logging in...")

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      toast.error("Invalid username or password.", { id: loadingId })
      return
    }

    setAuthed(true)
    setUsername("")
    setPassword("")
    toast.success("Logged in successfully!", { id: loadingId })
    await loadEditors()
  }

  const handleLogout = async () => {
    const loadingId = toast.loading("Logging out...")
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      setAuthed(false)
      setMenuData(null)
      setGalleryData(null)
      setActiveSection(null)
      toast.success("Logged out successfully", { id: loadingId })
    } catch (e) {
      toast.error("Failed to log out", { id: loadingId })
    }
  }

  const handleSaveMenu = async () => {
    if (!menuData) return false
    setIsSavingMenu(true)
    const loadingId = toast.loading("Saving menu...")
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(menuData),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        let errorMessage = "Failed to save menu"
        try {
          const errJson = JSON.parse(errText)
          if (errJson.error) errorMessage = errJson.error
        } catch {
          if (errText) errorMessage = errText
        }
        throw new Error(errorMessage)
      }
      const json = (await res.json()) as { data?: MenuData; deploy?: { message?: string } } | MenuData
      const savedData = "data" in json && json.data ? json.data : (json as MenuData)
      const deployMessage = "deploy" in json && json.deploy?.message ? json.deploy.message : "Changes saved successfully."
      setMenuData(savedData)
      setDirtyMenuItems({})
      toast.success(deployMessage, { id: loadingId })
      setIsSavingMenu(false)
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save menu", { id: loadingId })
      setIsSavingMenu(false)
      return false
    }
  }

  const handleSaveGallery = async (dataToSave?: GalleryData) => {
    const data = dataToSave || galleryData;
    if (!data) return false
    setIsSavingGallery(true)
    const loadingId = toast.loading("Saving gallery...")
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        let errorMessage = "Failed to save gallery"
        try {
          const errJson = JSON.parse(errText)
          if (errJson.error) errorMessage = errJson.error
        } catch {
          if (errText) errorMessage = errText
        }
        throw new Error(errorMessage)
      }
      const json = (await res.json()) as { data?: GalleryData; deploy?: { message?: string } } | GalleryData
      const savedData = "data" in json && json.data ? json.data : (json as GalleryData)
      const deployMessage = "deploy" in json && json.deploy?.message ? json.deploy.message : "Changes saved successfully."
      setGalleryData(savedData)
      setDirtyGalleryItems({})
      toast.success(deployMessage, { id: loadingId })
      setIsSavingGallery(false)
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save gallery", { id: loadingId })
      setIsSavingGallery(false)
      return false
    }
  }

  const menuItemKey = (tab: MenuTabKey, categoryIndex: number, itemIndex: number) => `${tab}-${categoryIndex}-${itemIndex}`

  const updateMenuTabs = (updater: (tabs: MenuTabs) => MenuTabs) => {
    setMenuData((current) => (current ? { ...current, tabs: updater(current.tabs) } : current))
  }

  const updateCategory = (tab: MenuTabKey, categoryIndex: number, field: keyof MenuCategory, value: string) => {
    updateMenuTabs((tabs) => ({
      ...tabs,
      [tab]: tabs[tab].map((category, index) =>
        index === categoryIndex ? { ...category, [field]: value } : category,
      ),
    }))
  }

  const addCategory = (tab: MenuTabKey) => {
    updateMenuTabs((tabs) => ({
      ...tabs,
      [tab]: [...tabs[tab], emptyMenuCategory()],
    }))
  }

  const removeCategory = (tab: MenuTabKey, categoryIndex: number) => {
    updateMenuTabs((tabs) => ({
      ...tabs,
      [tab]: tabs[tab].filter((_, index) => index !== categoryIndex),
    }))
  }

  const addMenuItem = (tab: MenuTabKey, categoryIndex: number) => {
    updateMenuTabs((tabs) => ({
      ...tabs,
      [tab]: tabs[tab].map((category, index) =>
        index === categoryIndex ? { ...category, items: [...category.items, emptyMenuItem()] } : category,
      ),
    }))
  }

  const removeMenuItem = (tab: MenuTabKey, categoryIndex: number, itemIndex: number) => {
    updateMenuTabs((tabs) => ({
      ...tabs,
      [tab]: tabs[tab].map((category, index) =>
        index === categoryIndex
          ? { ...category, items: category.items.filter((_, itemIdx) => itemIdx !== itemIndex) }
          : category,
      ),
    }))
  }

  const updateMenuItem = (
    tab: MenuTabKey,
    categoryIndex: number,
    itemIndex: number,
    field: keyof MenuItem,
    value: string,
  ) => {
    setDirtyMenuItems((prev) => ({ ...prev, [menuItemKey(tab, categoryIndex, itemIndex)]: true }))
    updateMenuTabs((tabs) => ({
      ...tabs,
      [tab]: tabs[tab].map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              items: category.items.map((item, idx) => (idx === itemIndex ? { ...item, [field]: value } : item)),
            }
          : category,
      ),
    }))
  }

  const updateGallery = (updater: (images: GalleryImage[]) => GalleryImage[]) => {
    setGalleryData((current) => (current ? { ...current, images: updater(current.images) } : current))
  }

  const updateGalleryItem = (index: number, field: keyof GalleryImage, value: string) => {
    const currentId = galleryData?.images[index]?.id
    if (currentId) {
      setDirtyGalleryItems((prev) => ({ ...prev, [currentId]: true }))
    }
    updateGallery((images) => images.map((image, idx) => (idx === index ? { ...image, [field]: value } : image)))
  }

  const addGalleryItem = () => {
    updateGallery((images) => [...images, emptyGalleryImage()])
  }

  const removeGalleryItemAndSave = async (index: number) => {
    if (!galleryData) return
    const nextGalleryData = {
      ...galleryData,
      images: galleryData.images.filter((_, idx) => idx !== index),
    }
    setGalleryData(nextGalleryData)
    await handleSaveGallery(nextGalleryData)
  }

  const uploadGalleryFile = async (galleryId: string, file: File) => {
    setIsUploading((prev) => ({ ...prev, [galleryId]: true }))
    const loadingId = toast.loading("Uploading image...")
    try {
      const form = new FormData()
      form.append("file", file)
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: form,
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(txt || "Upload failed")
      }
      const data = (await res.json()) as { url: string; name: string }
      const cleanedName = data.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim()
      if (galleryData) {
        const nextGalleryData: GalleryData = {
          ...galleryData,
          images: galleryData.images.map((img) =>
            img.id === galleryId
              ? {
                  ...img,
                  src: data.url,
                  alt: img.alt || cleanedName,
                  description: img.description || cleanedName,
                }
              : img,
          ),
        }
        setGalleryData(nextGalleryData)
        setDirtyGalleryItems((prev) => ({ ...prev, [galleryId]: true }))
        await handleSaveGallery(nextGalleryData)
        toast.success("Image uploaded successfully", { id: loadingId })
      } else {
        toast.success("Upload complete.", { id: loadingId })
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed", { id: loadingId })
    } finally {
      setIsUploading((prev) => ({ ...prev, [galleryId]: false }))
    }
  }

  const addGalleryFromUpload = async (file: File) => {
    if (!galleryData) return
    const fresh = emptyGalleryImage()
    const nextGalleryData = {
      ...galleryData,
      images: [...galleryData.images, fresh],
    }
    setGalleryData(nextGalleryData)
    await uploadGalleryFile(fresh.id, file)
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-8 flex justify-center items-center">
          <h1 className="menu-font text-3xl md:text-4xl font-semibold">Admin Panel</h1>
          <div className="absolute right-0 flex items-center gap-4">
            {canUseEditor && (
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {checkingSession && !canUseEditor && (
          <div className="mb-5 flex flex-col items-center justify-center rounded-2xl border border-[#E8D5C4] bg-card/85 px-4 py-5 text-muted-foreground shadow-sm animate-pulse dark:border-white/10 dark:bg-[#1F1A17]/85">
            <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mb-4" />
            <p className="font-medium text-center">Checking admin session...</p>
          </div>
        )}

        {!canUseEditor && (
          <form
            onSubmit={handleLogin}
            className="w-full max-w-md mx-auto rounded-3xl border border-[#E8D5C4] bg-card/90 p-5 shadow-xl shadow-[#3D2E24]/5 backdrop-blur-md sm:p-6 dark:border-white/10 dark:bg-[#1F1A17]/90 dark:shadow-black/30"
          >
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="username">
              Admin Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 mb-4 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC] text-foreground shadow-inner shadow-[#3D2E24]/5 transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#E8A4B8]/60 focus:border-[#E8A4B8] dark:border-white/10 dark:bg-[#2A2420] dark:shadow-black/20 dark:focus:border-[#D4869E] dark:focus:ring-[#D4869E]/40"
            />
            <label className="block text-sm font-semibold text-foreground mb-2" htmlFor="password">
              Admin Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC] dark:border-white/10 dark:bg-[#1A1512] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all text-foreground shadow-inner shadow-[#3D2E24]/5 transition-all placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#E8A4B8]/60 focus:border-[#E8A4B8] dark:border-white/10 dark:bg-[#2A2420] dark:shadow-black/20 dark:focus:border-[#D4869E] dark:focus:ring-[#D4869E]/40"
            />
            <button
              type="submit"
              className="mt-5 w-full rounded-xl border border-[#D4B896] bg-[#F5EDE6] px-4 py-3 font-semibold text-[#3D2E24] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#E8A4B8] hover:bg-[#E8A4B8] hover:text-white hover:shadow-lg hover:shadow-[#E8A4B8]/25 active:translate-y-0 dark:border-[#4A3C2C] dark:bg-[#2A2420] dark:text-[#FDF8F3] dark:hover:border-[#D4869E] dark:hover:bg-[#D4869E]"
            >
              Login
            </button>
          </form>
        )}

        {canUseEditor && !activeSection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <button
              onClick={() => setActiveSection("menu")}
              className="w-full block bg-white/75 border border-[#E8D5C4] rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow text-left group dark:bg-[#1A1512]/80 dark:border-white/10"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="menu-font text-2xl font-semibold">Edit Menu</h2>
              </div>
              <p className="text-muted-foreground">Add, edit, and delete menu items with categories</p>
            </button>

            <button
              onClick={() => setActiveSection("gallery")}
              className="w-full block bg-white/75 border border-[#E8D5C4] rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow text-left group dark:bg-[#1A1512]/80 dark:border-white/10"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="menu-font text-2xl font-semibold">Edit Gallery</h2>
              </div>
              <p className="text-muted-foreground">Upload photos and manage gallery content</p>
            </button>
          </div>
        )}

        {canUseEditor && activeSection === "menu" && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveSection(null)}
              className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Admin Panel
            </button>
            
            <section className="bg-white/75 border border-[#E8D5C4] rounded-3xl p-6 shadow-lg dark:bg-[#1A1512]/80 dark:border-white/10">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="menu-font text-2xl font-semibold">Menu Editor</h2>
                  <p className="text-sm text-muted-foreground">Edit categories and menu items.</p>
                </div>
                <MagneticButton>
                  <button 
                    type="button" 
                    className="btn-creme px-6 py-2 rounded-xl font-semibold flex items-center justify-center min-w-[140px] transition-all hover:scale-105 active:scale-95" 
                    onClick={() => handleSaveMenu()}
                    disabled={isSavingMenu}
                  >
                    {isSavingMenu ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-pink-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "Save Menu"
                    )}
                  </button>
                </MagneticButton>
              </div>
              <input
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search menu item by name..."
                className="w-full px-4 py-3 mb-4 rounded-xl border border-[#E8D5C4] bg-white dark:border-white/10 dark:bg-[#2A2420] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
              />

              {menuData && (() => {
                const searchLower = menuSearch.trim().toLowerCase()
                
                const filteredTabs = (Object.keys(TAB_LABELS) as MenuTabKey[]).map(tabKey => {
                  const categories = menuData.tabs[tabKey]
                    .map((category, categoryIndex) => {
                      const matchesCategoryName = searchLower ? category.name.toLowerCase().includes(searchLower) : true
                      
                      const items = category.items
                        .map((item, itemIndex) => ({ item, itemIndex }))
                        .filter(({ item }) =>
                          searchLower
                            ? item.name.toLowerCase().includes(searchLower) || (item.description && item.description.toLowerCase().includes(searchLower))
                            : true
                        )
                        
                      if (searchLower && !matchesCategoryName && items.length === 0) {
                        return null
                      }
                      
                      return { ...category, categoryIndex, filteredItems: items }
                    })
                    .filter(Boolean) as (MenuCategory & { categoryIndex: number, filteredItems: { item: MenuItem, itemIndex: number }[] })[]
                    
                  return { tabKey, categories }
                }).filter(tab => tab.categories.length > 0)

                if (filteredTabs.length === 0) {
                  return (
                    <div className="text-center py-12 border-2 border-dashed border-[#E8D5C4] dark:border-[#4A3C2C] rounded-3xl">
                      <p className="text-muted-foreground font-medium">No menu items found matching "{menuSearch}"</p>
                    </div>
                  )
                }

                return (
                  <div className="space-y-8">
                    {filteredTabs.map(({ tabKey: tab, categories }) => (
                      <div key={tab} className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                          <h3 className="menu-font text-xl font-semibold">{TAB_LABELS[tab]}</h3>
                          <button type="button" className="btn-creme px-4 py-2 rounded-xl font-semibold text-sm sm:text-base w-full sm:w-auto" onClick={() => addCategory(tab)}>
                            Add Category
                          </button>
                        </div>

                        <div className="space-y-5">
                          {categories.map((category) => (
                            <div key={`${tab}-${category.categoryIndex}`} className="rounded-2xl border border-[#E8D5C4] bg-[#FFFCF8] p-5 dark:border-white/10 dark:bg-[#1A1512]">
                              <div className="flex items-center justify-between gap-4 mb-4">
                                <input
                                  value={category.name}
                                  onChange={(e) => updateCategory(tab, category.categoryIndex, "name", e.target.value)}
                                  placeholder="Category name"
                                  className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white dark:border-white/10 dark:bg-[#2A2420] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                                />
                                <button
                                  type="button"
                                  className="px-3 py-2 rounded-xl border border-pink-200 text-pink-700 bg-pink-50 dark:border-pink-900/50 dark:text-pink-400 dark:bg-pink-950/30 transition-colors hover:bg-pink-100 dark:hover:bg-pink-900/50"
                                  onClick={() => removeCategory(tab, category.categoryIndex)}
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="space-y-3">
                                {category.filteredItems.map(({ item, itemIndex }) => (
                                  <div key={`${tab}-${category.categoryIndex}-${itemIndex}`} className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-3 rounded-2xl border border-[#EFE2D7] bg-white p-4 dark:border-white/10 dark:bg-[#2A2420]">
                                    <input
                                      value={item.name}
                                      onChange={(e) => updateMenuItem(tab, category.categoryIndex, itemIndex, "name", e.target.value)}
                                      placeholder="Dish name"
                                      className="col-span-2 md:col-span-3 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC] dark:border-white/10 dark:bg-[#1A1512] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                                    />
                                    <input
                                      value={item.description ?? ""}
                                      onChange={(e) => updateMenuItem(tab, category.categoryIndex, itemIndex, "description", e.target.value)}
                                      placeholder="Description"
                                      className="col-span-2 md:col-span-3 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC] dark:border-white/10 dark:bg-[#1A1512] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                                    />
                                    <input
                                      value={item.price ?? ""}
                                      onChange={(e) => updateMenuItem(tab, category.categoryIndex, itemIndex, "price", e.target.value)}
                                      placeholder="Price"
                                      className="col-span-1 md:col-span-2 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC] dark:border-white/10 dark:bg-[#1A1512] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                                    />
                                    <input
                                      value={item.vegPrice ?? ""}
                                      onChange={(e) => updateMenuItem(tab, category.categoryIndex, itemIndex, "vegPrice", e.target.value)}
                                      placeholder="Veg price"
                                      className="col-span-1 md:col-span-2 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC] dark:border-white/10 dark:bg-[#1A1512] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                                    />
                                    <div className="col-span-2 md:col-span-2 flex gap-2">
                                      <input
                                        value={item.nonVegPrice ?? ""}
                                        onChange={(e) => updateMenuItem(tab, category.categoryIndex, itemIndex, "nonVegPrice", e.target.value)}
                                        placeholder="Non-veg price"
                                        className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC] dark:border-white/10 dark:bg-[#1A1512] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                                      />
                                      <button
                                        type="button"
                                        className="px-3 py-2 rounded-xl border border-pink-200 text-pink-700 bg-pink-50 dark:border-pink-900/50 dark:text-pink-400 dark:bg-pink-950/30 transition-colors hover:bg-pink-100 dark:hover:bg-pink-900/50 whitespace-nowrap"
                                        onClick={() => removeMenuItem(tab, category.categoryIndex, itemIndex)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                className="btn-creme mt-4 px-4 py-2 rounded-xl font-semibold"
                                onClick={() => addMenuItem(tab, category.categoryIndex)}
                              >
                                Add Item
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </section>
          </div>
        )}

        {canUseEditor && activeSection === "gallery" && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveSection(null)}
              className="mb-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Admin Panel
            </button>

            <section className="bg-white/75 border border-[#E8D5C4] rounded-3xl p-6 shadow-lg dark:bg-[#1A1512]/80 dark:border-white/10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="menu-font text-2xl font-semibold">Gallery Manager</h2>
                  <p className="text-sm text-muted-foreground">Upload photos and manage gallery content.</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  <button type="button" className="btn-creme px-4 py-2 rounded-xl font-semibold flex-1 sm:flex-none text-center" onClick={addGalleryItem}>
                    Add Image
                  </button>
                  <label className="btn-creme px-4 py-2 rounded-xl font-semibold cursor-pointer flex-1 sm:flex-none text-center">
                    Upload Photo
                    <input
                      ref={quickUploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        e.target.value = ""
                        if (file) addGalleryFromUpload(file)
                      }}
                    />
                  </label>
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <MagneticButton>
                      <button 
                        type="button" 
                        className="btn-creme px-6 py-2 rounded-xl font-semibold flex items-center justify-center w-full min-w-[140px] transition-all hover:scale-105 active:scale-95" 
                        onClick={() => handleSaveGallery()}
                        disabled={isSavingGallery}
                      >
                        {isSavingGallery ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4 text-pink-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save Gallery"
                        )}
                      </button>
                    </MagneticButton>
                  </div>
                </div>
              </div>

              {galleryData && (
                <div className="grid xl:grid-cols-2 gap-5">
                  {galleryData.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`rounded-2xl border bg-[#FFFCF8] p-4 shadow-sm transition-colors ${
                        dragOverId === image.id ? "border-[#E8A4B8] ring-2 ring-[#E8A4B8]/30" : "border-[#E8D5C4]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <p className="text-sm font-medium text-muted-foreground">Image #{index + 1}</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="px-3 py-2 rounded-xl border border-pink-200 text-pink-700 bg-pink-50 dark:border-pink-900/50 dark:text-pink-400 dark:bg-pink-950/30 transition-colors hover:bg-pink-100 dark:hover:bg-pink-900/50 text-sm"
                            onClick={() => removeGalleryItemAndSave(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8D5C4] bg-white px-4 py-3 dark:border-white/10 dark:bg-[#2A2420]">
                            <div>
                              <p className="text-sm font-semibold">Upload image</p>
                              <p className="text-xs text-muted-foreground">No compression. Saved to this website.</p>
                            </div>
                            <label className={`btn-creme px-4 py-2 rounded-xl font-semibold cursor-pointer ${isUploading[image.id] ? "opacity-70 pointer-events-none" : ""}`}>
                              {isUploading[image.id] ? "Uploading..." : "Choose file"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  e.target.value = ""
                                  if (file) uploadGalleryFile(image.id, file)
                                }}
                              />
                            </label>
                          </div>
                          <input
                            value={image.src}
                            onChange={(e) => updateGalleryItem(index, "src", e.target.value)}
                            placeholder="Image URL"
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white dark:border-white/10 dark:bg-[#2A2420] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                          />
                          <input
                            value={image.alt}
                            onChange={(e) => updateGalleryItem(index, "alt", e.target.value)}
                            placeholder="Image title"
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white dark:border-white/10 dark:bg-[#2A2420] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                          />
                          <textarea
                            value={image.description}
                            onChange={(e) => updateGalleryItem(index, "description", e.target.value)}
                            placeholder="Description"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white dark:border-white/10 dark:bg-[#2A2420] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all resize-none"
                          />
                          <select
                            value={image.size ?? "medium"}
                            onChange={(e) => updateGalleryItem(index, "size", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white dark:border-white/10 dark:bg-[#2A2420] dark:text-foreground focus:outline-none focus:border-[#E8A4B8] dark:focus:border-[#D4869E] focus:ring-1 focus:ring-[#E8A4B8] dark:focus:ring-[#D4869E] transition-all"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-[#E8D5C4] bg-[#F5EDE6] dark:border-white/10 dark:bg-[#2A2420] min-h-[220px] flex items-center justify-center">
                          {image.src ? (
                            <div className="relative w-full h-full min-h-[220px]">
                              <Image src={image.src} alt={image.alt || "Preview"} fill className="object-cover" />
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground px-4 text-center">Image preview appears here after adding a valid image URL.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

      </div>
    </main>
  )
}
