"use server";

import { db } from "@/db/index";
import { pages, pageSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const pageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

const sectionSchema = z.object({
  type: z.string().min(1),
  content: z.record(z.string(), z.unknown()),
  imageUrl: z.string().nullable().optional(),
});

function revalidatePagePaths(slug: string) {
  revalidatePath("/");
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
}

export async function getPageWithSections(pageId: number) {
  const [page] = await db
    .select()
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1);
  if (!page) return null;

  const sections = await db
    .select()
    .from(pageSections)
    .where(eq(pageSections.pageId, pageId))
    .orderBy(asc(pageSections.order));

  return { page, sections };
}

export async function updatePage(
  id: number,
  data: z.infer<typeof pageSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Donnees invalides" };

  await db
    .update(pages)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(pages.id, id));

  revalidatePagePaths(parsed.data.slug);
  return { success: true };
}

export async function createPage(
  data: z.infer<typeof pageSchema>
): Promise<{ success: boolean; error?: string; id?: number }> {
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Donnees invalides" };

  const [row] = await db
    .insert(pages)
    .values(parsed.data)
    .returning({ id: pages.id });

  revalidatePagePaths(parsed.data.slug);
  return { success: true, id: row.id };
}

export async function deletePage(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const [page] = await db
    .select({ slug: pages.slug })
    .from(pages)
    .where(eq(pages.id, id))
    .limit(1);

  await db.delete(pages).where(eq(pages.id, id));

  if (page) revalidatePagePaths(page.slug);
  return { success: true };
}

export async function createSection(
  pageId: number,
  data: z.infer<typeof sectionSchema>
): Promise<{ success: boolean; error?: string; id?: number }> {
  const parsed = sectionSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Donnees invalides" };

  // Get max order for this page
  const existing = await db
    .select({ order: pageSections.order })
    .from(pageSections)
    .where(eq(pageSections.pageId, pageId))
    .orderBy(asc(pageSections.order));

  const maxOrder =
    existing.length > 0 ? Math.max(...existing.map((e) => e.order)) : -1;

  const [row] = await db
    .insert(pageSections)
    .values({
      pageId,
      order: maxOrder + 1,
      type: parsed.data.type,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl ?? null,
    })
    .returning({ id: pageSections.id });

  // Find the page slug to revalidate
  const [page] = await db
    .select({ slug: pages.slug })
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1);
  if (page) revalidatePagePaths(page.slug);

  return { success: true, id: row.id };
}

export async function updateSection(
  id: number,
  data: z.infer<typeof sectionSchema>
): Promise<{ success: boolean; error?: string }> {
  const parsed = sectionSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Donnees invalides" };

  await db
    .update(pageSections)
    .set({
      type: parsed.data.type,
      content: parsed.data.content,
      imageUrl: parsed.data.imageUrl ?? null,
    })
    .where(eq(pageSections.id, id));

  // Revalidate
  const [section] = await db
    .select({ pageId: pageSections.pageId })
    .from(pageSections)
    .where(eq(pageSections.id, id))
    .limit(1);
  if (section) {
    const [page] = await db
      .select({ slug: pages.slug })
      .from(pages)
      .where(eq(pages.id, section.pageId))
      .limit(1);
    if (page) revalidatePagePaths(page.slug);
  }

  return { success: true };
}

export async function deleteSection(
  id: number
): Promise<{ success: boolean; error?: string }> {
  // Get page info before deleting
  const [section] = await db
    .select({ pageId: pageSections.pageId })
    .from(pageSections)
    .where(eq(pageSections.id, id))
    .limit(1);

  await db.delete(pageSections).where(eq(pageSections.id, id));

  if (section) {
    const [page] = await db
      .select({ slug: pages.slug })
      .from(pages)
      .where(eq(pages.id, section.pageId))
      .limit(1);
    if (page) revalidatePagePaths(page.slug);
  }

  return { success: true };
}

export async function reorderSections(
  pageId: number,
  orderedIds: number[]
): Promise<{ success: boolean; error?: string }> {
  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(pageSections)
      .set({ order: i })
      .where(eq(pageSections.id, orderedIds[i]));
  }

  const [page] = await db
    .select({ slug: pages.slug })
    .from(pages)
    .where(eq(pages.id, pageId))
    .limit(1);
  if (page) revalidatePagePaths(page.slug);

  return { success: true };
}
