import fs from "fs/promises";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { menuCategories, menuItems, galleryImages } from "../db/schema";
import type { MenuData } from "../lib/menu-types";
import type { GalleryData } from "../lib/gallery-types";

const DATA_DIR = path.join(process.cwd(), "data");
const MENU_PATH = path.join(DATA_DIR, "menu.json");
const GALLERY_PATH = path.join(DATA_DIR, "gallery.json");

async function migrate() {
  console.log("Starting migration...");

  // 1. Migrate Menu
  try {
    const menuRaw = await fs.readFile(MENU_PATH, "utf8");
    const menuData = JSON.parse(menuRaw) as MenuData;

    for (const [tab, categories] of Object.entries(menuData.tabs)) {
      console.log(`Migrating tab: ${tab}...`);
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const [insertedCategory] = await db.insert(menuCategories).values({
          tab: tab as any,
          name: category.name,
          order: i,
        }).returning();

        for (let j = 0; j < category.items.length; j++) {
          const item = category.items[j];
          await db.insert(menuItems).values({
            categoryId: insertedCategory.id,
            name: item.name,
            description: item.description,
            price: item.price,
            vegPrice: item.vegPrice,
            nonVegPrice: item.nonVegPrice,
            order: j,
          });
        }
      }
    }
    console.log("Menu migration complete.");
  } catch (e) {
    console.error("Menu migration failed (might not exist yet):", e);
  }

  // 2. Migrate Gallery
  try {
    const galleryRaw = await fs.readFile(GALLERY_PATH, "utf8");
    const galleryData = JSON.parse(galleryRaw) as GalleryData;

    for (let i = 0; i < galleryData.images.length; i++) {
      const img = galleryData.images[i];
      await db.insert(galleryImages).values({
        src: img.src,
        alt: img.alt,
        description: img.description,
        size: img.size as any,
        order: i,
      });
    }
    console.log("Gallery migration complete.");
  } catch (e) {
    console.error("Gallery migration failed (might not exist yet):", e);
  }

  console.log("Migration finished.");
  process.exit(0);
}

migrate();
