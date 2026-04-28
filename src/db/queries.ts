import { db } from "./index";
import { eq, asc } from "drizzle-orm";
import * as schema from "./schema";
import { cache } from "react";

export const getSiteSettings = cache(async () => {
  const rows = await db.select().from(schema.siteSettings).limit(1);
  return rows[0] ?? null;
});

export const getPublishedPages = cache(async () => {
  return db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.status, "published"))
    .orderBy(schema.pages.slug);
});

export const getPageBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export const getPageSections = cache(async (pageId: number) => {
  return db
    .select()
    .from(schema.pageSections)
    .where(eq(schema.pageSections.pageId, pageId))
    .orderBy(asc(schema.pageSections.order));
});

export const getPublishedServices = cache(async () => {
  return db
    .select()
    .from(schema.services)
    .where(eq(schema.services.published, true))
    .orderBy(asc(schema.services.order));
});

export const getServiceBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(schema.services)
    .where(eq(schema.services.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export const getPublishedBlogPosts = cache(async () => {
  return db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.status, "published"))
    .orderBy(schema.blogPosts.publishedAt);
});

export const getBlogPostBySlug = cache(async (slug: string) => {
  const rows = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, slug))
    .limit(1);
  return rows[0] ?? null;
});

export const getPublishedTestimonials = cache(async () => {
  return db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.published, true))
    .orderBy(asc(schema.testimonials.order));
});

export const getPublishedFaqs = cache(async () => {
  return db
    .select()
    .from(schema.faqs)
    .where(eq(schema.faqs.published, true))
    .orderBy(asc(schema.faqs.order));
});

export const getAllMedia = cache(async () => {
  return db
    .select()
    .from(schema.media)
    .orderBy(schema.media.uploadedAt);
});
