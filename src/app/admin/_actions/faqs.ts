"use server";

import { db } from "@/db/index";
import { faqs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional(),
  order: z.number().int(),
  published: z.boolean(),
  serviceId: z.number().int().nullable().optional(),
});

export async function createFaq(data: z.infer<typeof faqSchema>) {
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  await db.insert(faqs).values(parsed.data);
  revalidatePath("/");
  return { success: true };
}

export async function updateFaq(id: number, data: z.infer<typeof faqSchema>) {
  const parsed = faqSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  await db.update(faqs).set(parsed.data).where(eq(faqs.id, id));
  revalidatePath("/");
  return { success: true };
}

export async function deleteFaq(id: number) {
  await db.delete(faqs).where(eq(faqs.id, id));
  revalidatePath("/");
  return { success: true };
}
