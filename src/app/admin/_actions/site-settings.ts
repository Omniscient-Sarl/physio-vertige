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
  // Hero
  homeHeroImageUrl: z.string().optional(),
  homeHeroImageAlt: z.string().optional(),
  // Mini-bio
  aboutImageUrl: z.string().optional(),
  aboutImageAlt: z.string().optional(),
  // Anatomy
  homeAnatomyDiagramUrl: z.string().optional(),
  homeAnatomyCaption: z.string().optional(),
  // Contact display
  openingHoursText: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  googleMapsEmbedUrl: z.string().optional(),
  // Footer
  footerDescription: z.string().optional(),
  footerServiceArea: z.string().optional(),
  // SEO & Google
  defaultOgImageUrl: z.string().optional(),
  googleVerification: z.string().optional(),
  googleBusinessUrl: z.string().optional(),
  googleReviewCount: z.string().optional(),
  googleAverageRating: z.string().optional(),
});

export async function updateSiteSettings(
  data: z.infer<typeof settingsSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Donnees invalides" };

  const existing = await db.select().from(siteSettings).limit(1);

  const values = {
    ...parsed.data,
    googleReviewCount: parsed.data.googleReviewCount
      ? parseInt(parsed.data.googleReviewCount, 10)
      : null,
    updatedAt: new Date(),
  };

  if (existing.length === 0) {
    await db.insert(siteSettings).values(values);
  } else {
    await db
      .update(siteSettings)
      .set(values)
      .where(eq(siteSettings.id, existing[0].id));
  }

  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/cabinet");
  revalidatePath("/le-physiotherapeute");
  revalidatePath("/vertiges-traites");
  revalidatePath("/blog");
  return { success: true };
}
