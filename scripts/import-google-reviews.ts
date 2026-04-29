import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, or, isNull } from "drizzle-orm";
import * as schema from "../src/db/schema";
import * as fs from "fs";
import * as path from "path";

const sqlClient = neon(process.env.DATABASE_URL as string);
const db = drizzle(sqlClient, { schema });

interface ScrapedReview {
  review_id: string;
  author_name: string;
  author_avatar_url: string;
  rating: number;
  relative_time: string;
  content: string;
}

interface ScrapedData {
  scraped_at: string;
  place_url: string;
  unique_count?: number;
  total_count?: number;
  with_content_count?: number;
  average_rating: number;
  reviews: ScrapedReview[];
}

async function run() {
  // Accept optional file path argument
  const customPath = process.argv.slice(2).find((a) => !a.startsWith("--"));
  const filePath = customPath
    ? path.resolve(customPath)
    : path.join(process.cwd(), "scraped", "google-reviews.json");

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    console.error("Run 'npm run scrape:google-reviews' first.");
    process.exit(1);
  }

  const data: ScrapedData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const reviewCount = data.unique_count ?? data.total_count ?? data.reviews.length;
  console.log(`Importing ${data.reviews.length} Google reviews from ${path.basename(filePath)}...`);

  // Delete old seed/manual testimonials (no source or source='manual')
  await db
    .delete(schema.testimonials)
    .where(
      or(
        isNull(schema.testimonials.source),
        eq(schema.testimonials.source, "manual")
      )
    );
  console.log("Deleted old seed/manual testimonials");

  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < data.reviews.length; i++) {
    const review = data.reviews[i];
    if (!review.content || review.content.length < 5) {
      skipped++;
      continue;
    }

    // Check if already exists by external_id
    const existing = await db
      .select()
      .from(schema.testimonials)
      .where(eq(schema.testimonials.externalId, review.review_id))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(schema.testimonials).values({
      authorName: review.author_name,
      content: review.content,
      rating: review.rating,
      order: i,
      published: true,
      source: "google",
      sourceUrl: data.place_url,
      authorAvatarUrl: review.author_avatar_url || null,
      relativeTime: review.relative_time || null,
      externalId: review.review_id,
    });
    inserted++;
  }

  // Update site_settings with review stats
  await db
    .update(schema.siteSettings)
    .set({
      googleReviewCount: reviewCount,
      googleAverageRating: data.average_rating.toString(),
    })
    .where(eq(schema.siteSettings.id, 1));

  console.log(`\nDone.`);
  console.log(`  Inserted: ${inserted}`);
  console.log(`  Skipped:  ${skipped} (empty or already present)`);
  console.log(`  site_settings: google_review_count=${reviewCount}, google_average_rating=${data.average_rating}`);
  console.log(`\nVercel will pick up changes on next revalidation (ISR 60s).`);
}

run().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});
