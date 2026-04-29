"use server";

import { db } from "@/db/index";
import { blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const blogSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImageUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),
  faq: z.array(faqItemSchema).default([]),
  publishedAt: z.date().nullable().optional(),
});

export async function createBlogPost(data: z.infer<typeof blogSchema>) {
  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  await db.insert(blogPosts).values({
    ...parsed.data,
    publishedAt: parsed.data.publishedAt ?? (parsed.data.status === "published" ? new Date() : null),
  });
  revalidatePath("/blog");
  return { success: true };
}

export async function updateBlogPost(id: number, data: z.infer<typeof blogSchema>) {
  const parsed = blogSchema.safeParse(data);
  if (!parsed.success) return { success: false, error: "Données invalides" };
  const { publishedAt, ...rest } = parsed.data;
  await db
    .update(blogPosts)
    .set({ ...rest, publishedAt: publishedAt ?? undefined, updatedAt: new Date() })
    .where(eq(blogPosts.id, id));
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  return { success: true };
}

export async function deleteBlogPost(id: number) {
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath("/blog");
  return { success: true };
}
