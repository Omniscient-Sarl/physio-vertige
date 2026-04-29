import { db } from "./index";
import { eq, asc, and, isNull, desc } from "drizzle-orm";
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

export const getPublishedTestimonials = cache(async (serviceId?: number) => {
  const conditions = [eq(schema.testimonials.published, true)];
  if (serviceId !== undefined) {
    conditions.push(eq(schema.testimonials.serviceId, serviceId));
  }
  return db
    .select()
    .from(schema.testimonials)
    .where(and(...conditions))
    .orderBy(asc(schema.testimonials.order));
});

export const getGlobalTestimonials = cache(async () => {
  return db
    .select()
    .from(schema.testimonials)
    .where(and(eq(schema.testimonials.published, true), isNull(schema.testimonials.serviceId)))
    .orderBy(asc(schema.testimonials.order));
});

export const getPublishedFaqs = cache(async (serviceId?: number) => {
  const conditions = [eq(schema.faqs.published, true)];
  if (serviceId !== undefined) {
    conditions.push(eq(schema.faqs.serviceId, serviceId));
  }
  return db
    .select()
    .from(schema.faqs)
    .where(and(...conditions))
    .orderBy(asc(schema.faqs.order));
});

export const getGlobalFaqs = cache(async () => {
  return db
    .select()
    .from(schema.faqs)
    .where(and(eq(schema.faqs.published, true), isNull(schema.faqs.serviceId)))
    .orderBy(asc(schema.faqs.order));
});

export const getPublishedBlogPostsByCategory = cache(async (category: string) => {
  return db
    .select()
    .from(schema.blogPosts)
    .where(and(eq(schema.blogPosts.status, "published"), eq(schema.blogPosts.category, category)))
    .orderBy(desc(schema.blogPosts.publishedAt));
});

export const getRelatedBlogPosts = cache(async (currentSlug: string, limit = 3) => {
  return db
    .select()
    .from(schema.blogPosts)
    .where(and(eq(schema.blogPosts.status, "published")))
    .orderBy(desc(schema.blogPosts.publishedAt))
    .limit(limit + 1)
    .then(rows => rows.filter(r => r.slug !== currentSlug).slice(0, limit));
});

export const getPageContent = cache(async (slug: string) => {
  const page = await getPageBySlug(slug);
  if (!page) return null;
  const sections = await getPageSections(page.id);
  const map = new Map<string, Record<string, unknown>>();
  for (const s of sections) {
    map.set(s.type, s.content);
  }
  return map;
});

export const getAllMedia = cache(async () => {
  return db
    .select()
    .from(schema.media)
    .orderBy(schema.media.uploadedAt);
});
