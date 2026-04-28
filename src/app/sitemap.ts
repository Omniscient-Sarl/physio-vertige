import type { MetadataRoute } from "next";
import { getPublishedServices, getPublishedBlogPosts } from "@/db/queries";

const BASE_URL = "https://physio-vertige.ch";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts] = await Promise.all([
    getPublishedServices(),
    getPublishedBlogPosts(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/le-physiotherapeute`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/vertiges-traites`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/cabinet`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/politique-de-confidentialite`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE_URL}/vertiges-traites/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...servicePages, ...blogPages];
}
