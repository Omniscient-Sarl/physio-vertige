import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import matter from "gray-matter";
import * as fs from "fs";
import * as path from "path";
import { normalizeGrokMarkdown } from "./lib/normalize-grok-markdown";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const filePath = args.find((a) => !a.startsWith("--"));

if (!filePath) {
  console.error("Usage: npm run db:import-post -- <path-to-markdown-file> [--dry-run]");
  process.exit(1);
}

const absolutePath = path.resolve(filePath);
if (!fs.existsSync(absolutePath)) {
  console.error(`File not found: ${absolutePath}`);
  process.exit(1);
}

const raw = fs.readFileSync(absolutePath, "utf-8");
const { data: fm, content: rawContent } = matter(raw);

// Normalize the markdown body
const { normalized: content, diff } = normalizeGrokMarkdown(rawContent, fm);

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

// Print normalizer diff summary
console.log("\n--- Normalizer Diff ---");
console.log(`  H1 prefixed:          ${diff.h1Prefixed}`);
console.log(`  H2 prefixed:          ${diff.h2Prefixed}`);
console.log(`  H3 numbered:          ${diff.h3Numbered}`);
console.log(`  H3 FAQ questions:     ${diff.h3Faq}`);
console.log(`  Bullet lists:         ${diff.bulletLists}`);
console.log(`  Callouts:             ${diff.callouts}`);
console.log(`  Inline links:         ${diff.inlineLinks}`);
console.log(`  Tables fixed:         ${diff.tablesFixed}`);
console.log(`  Sources enriched:     ${diff.authoritativeSourcesEnriched}`);
console.log(`  False citations:      ${diff.falsecitationsStripped}`);

if (dryRun) {
  console.log("\n--- DRY RUN: Normalized output ---\n");
  console.log(content);
  console.log("\n--- End of dry run (no DB write) ---");
  process.exit(0);
}

const sql = neon(process.env.DATABASE_URL as string);
const db = drizzle(sql, { schema });

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
    faq: faqItems.length > 0 ? faqItems : null,
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
  console.log(`FAQ count:      ${faqItems.length} (stored in faq column)`);
  console.log(`Cover image:    ${coverImageUrl ?? "none"}`);
  console.log(`Cover alt:      ${coverImageAlt}`);
  console.log(`Status:         ${status}`);
  console.log(`Published at:   ${publishedAt?.toISOString() ?? "not set"}`);
}

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
