import { z } from "zod"

export const GalleryImageSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  alt: z.string().min(1),
  description: z.string().min(1),
  size: z.enum(["small", "medium", "large"]).optional(),
})

export type GalleryImage = z.infer<typeof GalleryImageSchema>

export const GalleryDataSchema = z.object({
  images: z.array(GalleryImageSchema),
})

export type GalleryData = z.infer<typeof GalleryDataSchema>

