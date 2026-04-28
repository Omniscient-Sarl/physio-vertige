"use server";

import { db } from "@/db/index";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  googleVerification: z.string().optional(),
});

export async function updateSiteSettings(
  data: z.infer<typeof settingsSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };

  const existing = await db.select().from(siteSettings).limit(1);

  if (existing.length === 0) {
    await db.insert(siteSettings).values({
      ...parsed.data,
      updatedAt: new Date(),
    });
  } else {
    await db
      .update(siteSettings)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(siteSettings.id, existing[0].id));
  }

  revalidatePath("/");
  revalidatePath("/contact");
  return { success: true };
}
