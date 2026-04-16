"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import type { GalleryData, GalleryImage } from "@/lib/gallery-types"
import type { MenuCategory, MenuData, MenuItem, MenuTabKey, MenuTabs } from "@/lib/menu-types"

const TAB_LABELS: Record<MenuTabKey, string> = {
  food: "Food Menu",
  bar: "Bar Menu",
  beverages: "Beverages",
}

const emptyMenuItem = (): MenuItem => ({
  name: "",
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
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<string>("")

  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null)

  const canUseEditor = useMemo(() => authed === true, [authed])

  const fetchSession = async () => {
    const res = await fetch("/api/admin/session", { credentials: "include" })
    if (!res.ok) throw new Error("Failed to check session")
    const data = (await res.json()) as { authed: boolean }
    setAuthed(data.authed)
    return data.authed
  }

  const loadEditors = async () => {
    setStatus("Loading current menu/gallery...")

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
    setStatus("")
  }

  useEffect(() => {
    ;(async () => {
      try {
        const ok = await fetchSession()
        if (ok) await loadEditors()
      } catch (e) {
        setAuthed(false)
        setStatus(e instanceof Error ? e.message : "Failed to load admin page")
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Logging in...")

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    })

    if (!res.ok) {
      setStatus("Invalid password.")
      return
    }

    setAuthed(true)
    setPassword("")
    await loadEditors()
  }

  const handleSaveMenu = async () => {
    if (!menuData) return
    setStatus("Saving menu...")
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(menuData),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        throw new Error(errText || "Failed to save menu")
      }
      const saved = (await res.json()) as MenuData
      setMenuData(saved)
      setStatus("Menu saved.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to save menu")
    }
  }

  const handleSaveGallery = async () => {
    if (!galleryData) return
    setStatus("Saving gallery...")
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(galleryData),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        throw new Error(errText || "Failed to save gallery")
      }
      const saved = (await res.json()) as GalleryData
      setGalleryData(saved)
      setStatus("Gallery saved.")
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to save gallery")
    }
  }

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
    updateGallery((images) => images.map((image, idx) => (idx === index ? { ...image, [field]: value } : image)))
  }

  const addGalleryItem = () => {
    updateGallery((images) => [...images, emptyGalleryImage()])
  }

  const removeGalleryItem = (index: number) => {
    updateGallery((images) => images.filter((_, idx) => idx !== index))
  }

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    updateGallery((images) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= images.length) return images
      const next = [...images]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="menu-font text-3xl md:text-4xl font-semibold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Update the menu and gallery directly without editing code.
        </p>

        {authed === false && (
          <form onSubmit={handleLogin} className="max-w-md bg-white/80 border border-[#E8D5C4] rounded-3xl p-6 shadow-lg">
            <label className="block text-sm font-medium mb-2" htmlFor="password">
              Admin password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition-all"
            />
            <button
              type="submit"
              className="mt-4 btn-creme w-full px-4 py-3 rounded-xl font-semibold"
            >
              Login
            </button>
          </form>
        )}

        {canUseEditor && (
          <div className="space-y-10">
            <section className="bg-white/75 border border-[#E8D5C4] rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="menu-font text-2xl font-semibold">Menu Editor</h2>
                  <p className="text-sm text-muted-foreground">Edit categories and menu items like a content dashboard.</p>
                </div>
                <button type="button" className="btn-creme px-4 py-2 rounded-xl font-semibold" onClick={handleSaveMenu}>
                  Save Menu
                </button>
              </div>

              {menuData && (
                <div className="space-y-8">
                  {(Object.keys(TAB_LABELS) as MenuTabKey[]).map((tab) => (
                    <div key={tab} className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="menu-font text-xl font-semibold">{TAB_LABELS[tab]}</h3>
                        <button type="button" className="btn-creme px-4 py-2 rounded-xl font-semibold" onClick={() => addCategory(tab)}>
                          Add Category
                        </button>
                      </div>

                      <div className="space-y-5">
                        {menuData.tabs[tab].map((category, categoryIndex) => (
                          <div key={`${tab}-${categoryIndex}`} className="rounded-2xl border border-[#E8D5C4] bg-[#FFFCF8] p-5">
                            <div className="flex items-center justify-between gap-4 mb-4">
                              <input
                                value={category.name}
                                onChange={(e) => updateCategory(tab, categoryIndex, "name", e.target.value)}
                                placeholder="Category name"
                                className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white"
                              />
                              <button
                                type="button"
                                className="px-3 py-2 rounded-xl border border-pink-200 text-pink-700 bg-pink-50"
                                onClick={() => removeCategory(tab, categoryIndex)}
                              >
                                Remove
                              </button>
                            </div>

                            <div className="space-y-3">
                              {category.items.map((item, itemIndex) => (
                                <div key={`${tab}-${categoryIndex}-${itemIndex}`} className="grid md:grid-cols-5 gap-3 rounded-2xl border border-[#EFE2D7] bg-white p-4">
                                  <input
                                    value={item.name}
                                    onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "name", e.target.value)}
                                    placeholder="Dish name"
                                    className="md:col-span-2 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                  />
                                  <input
                                    value={item.price ?? ""}
                                    onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "price", e.target.value)}
                                    placeholder="Price"
                                    className="px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                  />
                                  <input
                                    value={item.vegPrice ?? ""}
                                    onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "vegPrice", e.target.value)}
                                    placeholder="Veg price"
                                    className="px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                  />
                                  <div className="flex gap-3">
                                    <input
                                      value={item.nonVegPrice ?? ""}
                                      onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "nonVegPrice", e.target.value)}
                                      placeholder="Non-veg price"
                                      className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                    />
                                    <button
                                      type="button"
                                      className="px-3 py-2 rounded-xl border border-pink-200 text-pink-700 bg-pink-50"
                                      onClick={() => removeMenuItem(tab, categoryIndex, itemIndex)}
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
                              onClick={() => addMenuItem(tab, categoryIndex)}
                            >
                              Add Item
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white/75 border border-[#E8D5C4] rounded-3xl p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="menu-font text-2xl font-semibold">Gallery Manager</h2>
                  <p className="text-sm text-muted-foreground">Edit images, captions, sizes, and order for the gallery grid.</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="btn-creme px-4 py-2 rounded-xl font-semibold" onClick={addGalleryItem}>
                    Add Image
                  </button>
                  <button type="button" className="btn-creme px-4 py-2 rounded-xl font-semibold" onClick={handleSaveGallery}>
                  Save Gallery
                  </button>
                </div>
              </div>

              {galleryData && (
                <div className="grid lg:grid-cols-2 gap-5">
                  {galleryData.images.map((image, index) => (
                    <div key={image.id} className="rounded-2xl border border-[#E8D5C4] bg-[#FFFCF8] p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <p className="text-sm font-medium text-muted-foreground">Image #{index + 1}</p>
                        <div className="flex gap-2">
                          <button type="button" className="btn-creme px-3 py-2 rounded-xl text-sm font-semibold" onClick={() => moveGalleryItem(index, -1)}>
                            Up
                          </button>
                          <button type="button" className="btn-creme px-3 py-2 rounded-xl text-sm font-semibold" onClick={() => moveGalleryItem(index, 1)}>
                            Down
                          </button>
                          <button
                            type="button"
                            className="px-3 py-2 rounded-xl border border-pink-200 text-pink-700 bg-pink-50 text-sm"
                            onClick={() => removeGalleryItem(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <input
                            value={image.src}
                            onChange={(e) => updateGalleryItem(index, "src", e.target.value)}
                            placeholder="Image URL"
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white"
                          />
                          <input
                            value={image.alt}
                            onChange={(e) => updateGalleryItem(index, "alt", e.target.value)}
                            placeholder="Image title"
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white"
                          />
                          <textarea
                            value={image.description}
                            onChange={(e) => updateGalleryItem(index, "description", e.target.value)}
                            placeholder="Description"
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white resize-none"
                          />
                          <select
                            value={image.size ?? "medium"}
                            onChange={(e) => updateGalleryItem(index, "size", e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white"
                          >
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-[#E8D5C4] bg-[#F5EDE6] min-h-[220px] flex items-center justify-center">
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

        {status && (
          <div className="mt-6 p-3 rounded-xl border border-pink-200 bg-white/50 text-sm">
            {status}
          </div>
        )}
      </div>
    </main>
  )
}

