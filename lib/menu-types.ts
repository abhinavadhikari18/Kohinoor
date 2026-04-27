import { z } from "zod"

export const MenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.string().min(1).optional(),
  vegPrice: z.string().min(1).optional(),
  nonVegPrice: z.string().min(1).optional(),
}).refine(
  (item) => {
    // Either a normal single `price` OR both `vegPrice` and `nonVegPrice`.
    const hasSinglePrice = typeof item.price === "string" && item.price.length > 0
    const hasVegPair =
      typeof item.vegPrice === "string" &&
      item.vegPrice.length > 0 &&
      typeof item.nonVegPrice === "string" &&
      item.nonVegPrice.length > 0
    return hasSinglePrice || hasVegPair
  },
  {
    message: "MenuItem must have either `price` or both `vegPrice` and `nonVegPrice`.",
  },
)

export type MenuItem = z.infer<typeof MenuItemSchema>

export const MenuCategorySchema = z.object({
  name: z.string().min(1),
  items: z.array(MenuItemSchema),
})

export type MenuCategory = z.infer<typeof MenuCategorySchema>

export const MenuTabsSchema = z.object({
  food: z.array(MenuCategorySchema),
  bar: z.array(MenuCategorySchema),
  beverages: z.array(MenuCategorySchema),
})

export type MenuTabs = z.infer<typeof MenuTabsSchema>

export const MenuDataSchema = z.object({
  tabs: MenuTabsSchema,
})

export type MenuData = z.infer<typeof MenuDataSchema>

export type MenuTabKey = keyof MenuTabs

