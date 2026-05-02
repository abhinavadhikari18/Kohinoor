import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { MenuDataSchema, type MenuData, type MenuTabKey } from "./menu-types";
import { GalleryDataSchema, type GalleryData } from "./gallery-types";
import { db } from "@/db";
import { menuCategories, menuItems, galleryImages } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getMenuData(): Promise<MenuData> {
  noStore();

  const allCategories = await db.query.menuCategories.findMany({
    orderBy: [asc(menuCategories.tab), asc(menuCategories.order)],
    with: {
      items: {
        orderBy: [asc(menuItems.order)],
      },
    },
  });

  const tabs: any = {
    food: [],
    bar: [],
    beverages: [],
  };

  allCategories.forEach((cat) => {
    tabs[cat.tab].push({
      name: cat.name,
      items: cat.items.map((item) => ({
        name: item.name,
        description: item.description ?? undefined,
        price: item.price ?? undefined,
        vegPrice: item.vegPrice ?? undefined,
        nonVegPrice: item.nonVegPrice ?? undefined,
      })),
    });
  });

  return MenuDataSchema.parse({ tabs });
}

import crypto from "crypto";

export async function saveMenuData(data: MenuData): Promise<MenuData> {
  const parsed = MenuDataSchema.parse(data);

  await db.transaction(async (tx) => {
    // Delete existing categories (and items via cascade)
    await tx.delete(menuCategories);

    // Prepare batch arrays
    const categoriesToInsert: any[] = [];
    const itemsToInsert: any[] = [];

    for (const [tab, categories] of Object.entries(parsed.tabs)) {
      for (let i = 0; i < categories.length; i++) {
        const catId = crypto.randomUUID();
        const category = categories[i];

        categoriesToInsert.push({
          id: catId,
          tab: tab as MenuTabKey,
          name: category.name,
          order: i,
        });

        if (category.items && category.items.length > 0) {
          category.items.forEach((item: any, itemIndex: number) => {
            itemsToInsert.push({
              id: crypto.randomUUID(),
              categoryId: catId,
              name: item.name,
              description: item.description,
              price: item.price,
              vegPrice: item.vegPrice,
              nonVegPrice: item.nonVegPrice,
              order: itemIndex,
            });
          });
        }
      }
    }

    if (categoriesToInsert.length > 0) {
      // 1. Batch Insert Categories
      await tx.insert(menuCategories).values(categoriesToInsert);

      // 2. Batch Insert Items
      if (itemsToInsert.length > 0) {
        await tx.insert(menuItems).values(itemsToInsert);
      }
    }
  });

  return parsed;
}

export async function getGalleryData(): Promise<GalleryData> {
  noStore();

  const images = await db.query.galleryImages.findMany({
    orderBy: [asc(galleryImages.order)],
  });

  return GalleryDataSchema.parse({
    images: images.map((img) => ({
      id: img.id,
      src: img.src,
      alt: img.alt,
      description: img.description,
      size: img.size ?? "medium",
    })),
  });
}

export async function saveGalleryData(data: GalleryData): Promise<GalleryData> {
  const parsed = GalleryDataSchema.parse(data);

  await db.transaction(async (tx) => {
    await tx.delete(galleryImages);

    if (parsed.images.length > 0) {
      const imagesToInsert = parsed.images.map((img, i) => ({
        id: img.id || crypto.randomUUID(),
        src: img.src,
        alt: img.alt,
        description: img.description,
        size: img.size as any,
        order: i,
      }));
      
      await tx.insert(galleryImages).values(imagesToInsert);
    }
  });

  return parsed;
}
