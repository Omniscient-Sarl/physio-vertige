import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  varchar,
  uniqueIndex,
  numeric,
} from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("Physio-Vertige"),
  tagline: text("tagline"),
  phone: text("phone"),
  email: text("email"),
  contactEmail: text("contact_email"),
  address: text("address"),
  openingHours: jsonb("opening_hours").$type<Record<string, string>>(),
  socialLinks: jsonb("social_links").$type<Record<string, string>>(),
  defaultOgImageUrl: text("default_og_image_url"),
  googleVerification: text("google_verification"),
  googleBusinessUrl: text("google_business_url"),
  homeHeroImageUrl: text("home_hero_image_url"),
  homeHeroImageAlt: text("home_hero_image_alt"),
  aboutImageUrl: text("about_image_url"),
  aboutImageAlt: text("about_image_alt"),
  homeAnatomyDiagramUrl: text("home_anatomy_diagram_url"),
  homeAnatomyCaption: text("home_anatomy_caption"),
  googleReviewCount: integer("google_review_count"),
  googleAverageRating: numeric("google_average_rating"),
  // Contact display
  openingHoursText: text("opening_hours_text"),
  googleMapsUrl: text("google_maps_url"),
  googleMapsEmbedUrl: text("google_maps_embed_url"),
  // Footer
  footerDescription: text("footer_description"),
  footerServiceArea: text("footer_service_area"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pages = pgTable(
  "pages",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: text("title").notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogImageUrl: text("og_image_url"),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("pages_slug_idx").on(table.slug)]
);

export const pageSections = pgTable("page_sections", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id")
    .notNull()
    .references(() => pages.id, { onDelete: "cascade" }),
  order: integer("order").notNull().default(0),
  type: varchar("type", { length: 50 }).notNull(),
  content: jsonb("content").$type<Record<string, unknown>>().notNull(),
  imageUrl: text("image_url"),
});

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: text("title").notNull(),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    iconName: varchar("icon_name", { length: 50 }),
    imageUrl: text("image_url"),
    order: integer("order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    // Condition page fields
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    heroHook: text("hero_hook"),
    symptoms: jsonb("symptoms").$type<string[]>(),
    causes: text("causes"),
    protocol: text("protocol"),
    sessionDescription: text("session_description"),
    sessionCount: text("session_count"),
    relatedSlugs: jsonb("related_slugs").$type<string[]>(),
  },
  (table) => [uniqueIndex("services_slug_idx").on(table.slug)]
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull(),
    title: text("title").notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    excerpt: text("excerpt"),
    content: text("content"),
    coverImageUrl: text("cover_image_url"),
    publishedAt: timestamp("published_at"),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    author: text("author").default("Arnaud Canadas"),
    tags: jsonb("tags").$type<string[]>().default([]),
    category: varchar("category", { length: 100 }),
    faq: jsonb("faq").$type<Array<{ question: string; answer: string }>>(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [uniqueIndex("blog_posts_slug_idx").on(table.slug)]
);

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  serviceId: integer("service_id").references(() => services.id, {
    onDelete: "set null",
  }),
  authorAvatarUrl: text("author_avatar_url"),
  source: varchar("source", { length: 50 }),
  sourceUrl: text("source_url"),
  relativeTime: text("relative_time"),
  externalId: varchar("external_id", { length: 255 }),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  serviceId: integer("service_id").references(() => services.id, {
    onDelete: "set null",
  }),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  uploadthingUrl: text("uploadthing_url").notNull(),
  uploadthingKey: text("uploadthing_key").notNull(),
  altText: text("alt_text").notNull(),
  width: integer("width"),
  height: integer("height"),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});
