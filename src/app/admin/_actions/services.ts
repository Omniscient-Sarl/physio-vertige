"use server";

import { db } from "@/db/index";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const serviceSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  iconName: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().int(),
  published: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  heroHook: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
  causes: z.string().optional(),
  protocol: z.string().optional(),
  sessionDescription: z.string().optional(),
  sessionCount: z.string().optional(),
  relatedSlugs: z.array(z.string()).optional(),
});

export async function createService(data: z.infer<typeof serviceSchema>) {
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  await db.insert(services).values(parsed.data);
  revalidatePath("/");
  revalidatePath("/vertiges-traites");
  return { success: true };
}

export async function updateService(id: number, data: z.infer<typeof serviceSchema>) {
  const parsed = serviceSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  await db.update(services).set(parsed.data).where(eq(services.id, id));
  revalidatePath("/");
  revalidatePath("/vertiges-traites");
  revalidatePath(`/vertiges-traites/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteService(id: number) {
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/");
  revalidatePath("/vertiges-traites");
  return { success: true };
}
