"use server";

import { db } from "@/db/index";
import { testimonials } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const testimonialSchema = z.object({
  authorName: z.string().min(1),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  order: z.number().int(),
  published: z.boolean(),
  serviceId: z.number().int().nullable().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
  relativeTime: z.string().optional(),
});

export async function createTestimonial(data: z.infer<typeof testimonialSchema>) {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  await db.insert(testimonials).values(parsed.data);
  revalidatePath("/");
  return { success: true };
}

export async function updateTestimonial(id: number, data: z.infer<typeof testimonialSchema>) {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, id));
  revalidatePath("/");
  return { success: true };
}

export async function deleteTestimonial(id: number) {
  await db.delete(testimonials).where(eq(testimonials.id, id));
  revalidatePath("/");
  return { success: true };
}
