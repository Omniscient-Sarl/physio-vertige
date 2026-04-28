import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import matter from "gray-matter";
import * as fs from "fs";
import * as path from "path";

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: npm run db:import-post -- <path-to-markdown-file>");
  process.exit(1);
}

const absolutePath = path.resolve(filePath);
if (!fs.existsSync(absolutePath)) {
  console.error(`File not found: ${absolutePath}`);
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const raw = fs.readFileSync(absolutePath, "utf-8");
const { data: fm, content } = matter(raw);

const slug = fm.slug as string;
const title = fm.title as string;
const metaTitle = (fm.meta_title as string) || null;
const metaDescription = (fm.meta_description as string) || null;
const category = (fm.category as string) || null;
const author = (fm.author as string) || "Arnaud Canadas";
const status = (fm.status as string) || "published";
const publishedAt = fm.published_at ? new Date(fm.published_at as string) : null;
const coverImageUrl = (fm.cover_image_url as string) || process.env.COVER_IMAGE_URL || null;
const coverImageAlt = (fm.cover_image_alt as string) || null;
const tags = (fm.tags as string[]) || [];
const faqItems = (fm.faq as Array<{ question: string; answer: string }>) || [];

// Compute reading time (1 min per 200 words, rounded up)
const wordCount = content.split(/\s+/).filter(Boolean).length;
const readingTimeMinutes =
  (fm.reading_time_minutes as number) || Math.max(1, Math.ceil(wordCount / 200));

// Generate excerpt from first paragraph of content
const firstParagraph = content
  .split("\n\n")
  .find((p) => p.trim() && !p.startsWith("#") && !p.startsWith("---"));
const excerpt = firstParagraph?.trim().slice(0, 300) || null;

async function run() {
  // Check if post already exists
  const existing = await db
    .select()
    .from(schema.blogPosts)
    .where(eq(schema.blogPosts.slug, slug))
    .limit(1);

  const values = {
    slug,
    title,
    metaTitle,
    metaDescription,
    excerpt,
    content: content.trim(),
    coverImageUrl,
    publishedAt,
    status,
    author,
    tags,
    category,
    updatedAt: new Date(),
  };

  if (existing.length > 0) {
    await db
      .update(schema.blogPosts)
      .set(values)
      .where(eq(schema.blogPosts.slug, slug));
    console.log(`Updated existing post: ${slug}`);
  } else {
    await db.insert(schema.blogPosts).values(values);
    console.log(`Inserted new post: ${slug}`);
  }

  // Insert media row for cover image if provided
  if (coverImageUrl) {
    const existingMedia = await db
      .select()
      .from(schema.media)
      .where(eq(schema.media.uploadthingUrl, coverImageUrl))
      .limit(1);
    if (existingMedia.length === 0) {
      await db.insert(schema.media).values({
        uploadthingUrl: coverImageUrl,
        uploadthingKey: coverImageUrl.split("/").pop() || "",
        altText: coverImageAlt || title,
      });
      console.log(`Inserted media row for cover image`);
    }
  }

  // Summary
  console.log("\n--- Import Summary ---");
  console.log(`Slug:           ${slug}`);
  console.log(`Title:          ${title}`);
  console.log(`Word count:     ${wordCount}`);
  console.log(`Reading time:   ${readingTimeMinutes} min`);
  console.log(`FAQ count:      ${faqItems.length} (embedded in body)`);
  console.log(`Cover image:    ${coverImageUrl ?? "none"}`);
  console.log(`Cover alt:      ${coverImageAlt}`);
  console.log(`Status:         ${status}`);
  console.log(`Published at:   ${publishedAt?.toISOString() ?? "not set"}`);
}

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
