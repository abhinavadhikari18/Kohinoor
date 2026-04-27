"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Gallery from "@/components/gallery"
import type { GalleryData, GalleryImage } from "@/lib/gallery-types"
import type { MenuCategory, MenuData, MenuItem, MenuTabKey, MenuTabs } from "@/lib/menu-types"

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
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<string>("")
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({})
  const [menuSearch, setMenuSearch] = useState("")
  const [dirtyMenuItems, setDirtyMenuItems] = useState<Record<string, boolean>>({})
  const [dirtyGalleryItems, setDirtyGalleryItems] = useState<Record<string, boolean>>({})
  const dragIndexRef = useRef<number | null>(null)
  const quickUploadRef = useRef<HTMLInputElement | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [galleryData, setGalleryData] = useState<GalleryData | null>(null)

  const menuItemKey = (tab: MenuTabKey, categoryIndex: number, itemIndex: number) => `${tab}-${categoryIndex}-${itemIndex}`

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

  const handleSaveMenu = async (nextMenuData?: MenuData) => {
    const payload = nextMenuData ?? menuData
    if (!payload) return false
    setStatus("Saving menu...")
    try {
      const res = await fetch("/api/admin/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        throw new Error(errText || "Failed to save menu")
      }
      const json = (await res.json()) as { data?: MenuData; deploy?: { message?: string } } | MenuData
      const savedData = "data" in json && json.data ? json.data : (json as MenuData)
      const deployMessage = "deploy" in json && json.deploy?.message ? json.deploy.message : "Changes saved successfully."
      setMenuData(savedData)
      setDirtyMenuItems({})
      setStatus(deployMessage)
      return true
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to save menu")
      return false
    }
  }

  const handleSaveGallery = async (nextGalleryData?: GalleryData) => {
    const payload = nextGalleryData ?? galleryData
    if (!payload) return false
    setStatus("Saving gallery...")
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => "")
        throw new Error(errText || "Failed to save gallery")
      }
      const json = (await res.json()) as { data?: GalleryData; deploy?: { message?: string } } | GalleryData
      const savedData = "data" in json && json.data ? json.data : (json as GalleryData)
      const deployMessage = "deploy" in json && json.deploy?.message ? json.deploy.message : "Changes saved successfully."
      setGalleryData(savedData)
      setDirtyGalleryItems({})
      setStatus(deployMessage)
      return true
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to save gallery")
      return false
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

  const removeGalleryItem = (index: number) => {
    updateGallery((images) => images.filter((_, idx) => idx !== index))
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

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    updateGallery((images) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= images.length) return images
      const next = [...images]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  const moveGalleryItemTo = (fromIndex: number, toIndex: number) => {
    updateGallery((images) => {
      if (fromIndex === toIndex) return images
      if (fromIndex < 0 || fromIndex >= images.length) return images
      if (toIndex < 0 || toIndex >= images.length) return images
      const next = [...images]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const uploadGalleryFile = async (galleryId: string, file: File) => {
    setIsUploading((prev) => ({ ...prev, [galleryId]: true }))
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
      } else {
        setStatus("Upload complete.")
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Upload failed")
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

  const saveMenuItem = async (tab: MenuTabKey, categoryIndex: number, itemIndex: number) => {
    const ok = await handleSaveMenu()
    if (!ok) return
    const key = menuItemKey(tab, categoryIndex, itemIndex)
    setDirtyMenuItems((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const saveGalleryItem = async (imageId: string) => {
    const ok = await handleSaveGallery()
    if (!ok) return
    setDirtyGalleryItems((prev) => {
      const next = { ...prev }
      delete next[imageId]
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
              <input
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search menu item by name..."
                className="w-full mb-4 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-white"
              />

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
                              {category.items
                                .map((item, itemIndex) => ({ item, itemIndex }))
                                .filter(({ item }) =>
                                  menuSearch.trim()
                                    ? item.name.toLowerCase().includes(menuSearch.trim().toLowerCase())
                                    : true,
                                )
                                .map(({ item, itemIndex }) => (
                                <div key={`${tab}-${categoryIndex}-${itemIndex}`} className="grid md:grid-cols-12 gap-3 rounded-2xl border border-[#EFE2D7] bg-white p-4">
                                  <input
                                    value={item.name}
                                    onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "name", e.target.value)}
                                    placeholder="Dish name"
                                    className="md:col-span-3 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                  />
                                  <input
                                    value={item.description ?? ""}
                                    onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "description", e.target.value)}
                                    placeholder="Description"
                                    className="md:col-span-4 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                  />
                                  <input
                                    value={item.price ?? ""}
                                    onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "price", e.target.value)}
                                    placeholder="Price"
                                    className="md:col-span-2 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                  />
                                  <input
                                    value={item.vegPrice ?? ""}
                                    onChange={(e) => updateMenuItem(tab, categoryIndex, itemIndex, "vegPrice", e.target.value)}
                                    placeholder="Veg price"
                                    className="md:col-span-1 px-4 py-3 rounded-xl border border-[#E8D5C4] bg-[#FFFDFC]"
                                  />
                                  <div className="md:col-span-2 flex gap-2">
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
                                    <button
                                      type="button"
                                      className="btn-creme px-3 py-2 rounded-xl font-semibold whitespace-nowrap"
                                      onClick={() => saveMenuItem(tab, categoryIndex, itemIndex)}
                                    >
                                      {dirtyMenuItems[menuItemKey(tab, categoryIndex, itemIndex)] ? "Save" : "Saved"}
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
                  <label className="btn-creme px-4 py-2 rounded-xl font-semibold cursor-pointer">
                    Upload New Photo
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
                  <button type="button" className="btn-creme px-4 py-2 rounded-xl font-semibold" onClick={handleSaveGallery}>
                  Save Gallery
                  </button>
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
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move"
                        dragIndexRef.current = index
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        if (dragOverId !== image.id) setDragOverId(image.id)
                      }}
                      onDrop={() => {
                        const from = dragIndexRef.current
                        if (typeof from === "number") moveGalleryItemTo(from, index)
                        dragIndexRef.current = null
                        setDragOverId(null)
                      }}
                      onDragEnd={() => {
                        dragIndexRef.current = null
                        setDragOverId(null)
                      }}
                    >
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
                            onClick={() => removeGalleryItemAndSave(index)}
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            className="btn-creme px-3 py-2 rounded-xl text-sm font-semibold"
                            onClick={() => saveGalleryItem(image.id)}
                          >
                            {dirtyGalleryItems[image.id] ? "Update" : "Saved"}
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="rounded-xl border border-dashed border-[#E8D5C4] bg-white/70 px-4 py-3">
                            <p className="text-sm font-semibold">Drag to reorder</p>
                            <p className="text-xs text-muted-foreground">
                              Grab this card and drag it up/down to rearrange the gallery.
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8D5C4] bg-white px-4 py-3">
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

              {galleryData && (
                <div className="mt-8 rounded-3xl border border-[#E8D5C4] bg-[#F5EDE6]/60 p-5">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <h3 className="menu-font text-xl font-semibold">Live Gallery Preview</h3>
                    <p className="text-sm text-muted-foreground">Updates instantly as you edit (including drag & drop order).</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-[#F5EDE6]">
                    <Gallery images={galleryData.images} />
                  </div>
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

