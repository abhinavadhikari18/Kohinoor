import fs from "fs/promises"
import path from "path"
import { unstable_noStore as noStore } from "next/cache"
import { MenuDataSchema, type MenuData } from "./menu-types"
import { GalleryDataSchema, type GalleryData } from "./gallery-types"
import { defaultMenuData } from "./menu-defaults"
import { defaultGalleryImages } from "./gallery-defaults"

const DATA_DIR = path.join(process.cwd(), "data")
const MENU_PATH = path.join(DATA_DIR, "menu.json")
const GALLERY_PATH = path.join(DATA_DIR, "gallery.json")

export async function getMenuData(): Promise<MenuData> {
  noStore()

  try {
    const raw = await fs.readFile(MENU_PATH, "utf8")
    const json = JSON.parse(raw) as unknown
    return MenuDataSchema.parse(json)
  } catch (err) {
    // If no admin overrides exist yet, fall back to the built-in defaults.
    if (err instanceof Error && (err as any).code === "ENOENT") return defaultMenuData
    throw err
  }
}

export async function saveMenuData(data: MenuData): Promise<MenuData> {
  const parsed = MenuDataSchema.parse(data)
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(MENU_PATH, JSON.stringify(parsed, null, 2), "utf8")
  return parsed
}

export async function getGalleryData(): Promise<GalleryData> {
  noStore()

  try {
    const raw = await fs.readFile(GALLERY_PATH, "utf8")
    const json = JSON.parse(raw) as unknown
    return GalleryDataSchema.parse(json)
  } catch (err) {
    if (err instanceof Error && (err as any).code === "ENOENT") {
      return { images: defaultGalleryImages }
    }
    throw err
  }
}

export async function saveGalleryData(data: GalleryData): Promise<GalleryData> {
  const parsed = GalleryDataSchema.parse(data)
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(GALLERY_PATH, JSON.stringify(parsed, null, 2), "utf8")
  return parsed
}

