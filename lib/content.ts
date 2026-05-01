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

export async function saveMenuData(data: MenuData): Promise<MenuData> {
  const parsed = MenuDataSchema.parse(data);

  await db.transaction(async (tx) => {
    // Delete existing categories (and items via cascade)
    await tx.delete(menuCategories);

    // Insert new data
    for (const [tab, categories] of Object.entries(parsed.tabs)) {
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const [insertedCategory] = await tx
          .insert(menuCategories)
          .values({
            tab: tab as MenuTabKey,
            name: category.name,
            order: i,
          })
          .returning();

        for (let j = 0; j < category.items.length; j++) {
          const item = category.items[j];
          await tx.insert(menuItems).values({
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

    for (let i = 0; i < parsed.images.length; i++) {
      const img = parsed.images[i];
      await tx.insert(galleryImages).values({
        id: img.id, // Keep the same ID if possible, but the schema uses defaultRandom. Wait, the schema should allow manual ID if needed, but it's okay for now.
        src: img.src,
        alt: img.alt,
        description: img.description,
        size: img.size as any,
        order: i,
      });
    }
  });

  return parsed;
}
