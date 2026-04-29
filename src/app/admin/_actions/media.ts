"use server";

import { db } from "@/db/index";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

const mediaSchema = z.object({
  uploadthingUrl: z.string().url(),
  uploadthingKey: z.string().min(1),
  altText: z.string().min(1, "Le texte alternatif est requis"),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});

export async function createMedia(data: z.infer<typeof mediaSchema>) {
  const parsed = mediaSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Donnees invalides" };
  await db.insert(media).values(parsed.data);
  revalidatePath("/admin/media");
  return { success: true };
}

export async function updateMediaAlt(id: number, altText: string) {
  await db.update(media).set({ altText }).where(eq(media.id, id));
  revalidatePath("/admin/media");
  return { success: true };
}

export async function deleteMedia(id: number) {
  const rows = await db
    .select()
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  if (rows.length > 0) {
    // Delete from UploadThing
    try {
      await utapi.deleteFiles(rows[0].uploadthingKey);
    } catch {
      // Continue even if UT delete fails
    }
    await db.delete(media).where(eq(media.id, id));
  }

  revalidatePath("/admin/media");
  return { success: true };
}
