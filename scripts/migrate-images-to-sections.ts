import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";
if (!url) { console.error("DATABASE_URL required"); process.exit(1); }

const sql = neon(url);
const db = drizzle(sql, { schema });

/**
 * Migrate image URLs from site_settings into page_sections.content
 * for hero, anatomy, mini_bio (homepage) and bio (/le-physiotherapeute).
 *
 * This is idempotent — it only sets values that are empty/missing in content.
 */
async function main() {
  // Get site settings
  const [settings] = await db.select().from(schema.siteSettings).limit(1);
  if (!settings) { console.log("No site_settings row"); return; }

  // Get homepage
  const [homePage] = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.slug, "/"))
    .limit(1);

  // Get le-physiotherapeute page
  const [bioPage] = await db
    .select()
    .from(schema.pages)
    .where(eq(schema.pages.slug, "/le-physiotherapeute"))
    .limit(1);

  if (!homePage) { console.log("No homepage found"); return; }

  // Get all sections for homepage
  const homeSections = await db
    .select()
    .from(schema.pageSections)
    .where(eq(schema.pageSections.pageId, homePage.id));

  // Mapping: section type -> { image_url, image_alt, caption? }
  const imageMap: Record<string, Record<string, string>> = {};

  if (settings.homeHeroImageUrl) {
    imageMap.hero = {
      image_url: settings.homeHeroImageUrl,
      image_alt: settings.homeHeroImageAlt ?? "Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges",
    };
  }

  if (settings.homeAnatomyDiagramUrl) {
    imageMap.anatomy = {
      image_url: settings.homeAnatomyDiagramUrl,
      image_alt: settings.homeAnatomyDiagramAlt ?? "Labyrinthe membraneux — schéma anatomique du système vestibulaire",
      caption: settings.homeAnatomyCaption ?? "Labyrinthe membraneux — vestibulaire (orange) et cochléaire (vert)",
    };
  }

  if (settings.aboutImageUrl) {
    imageMap.mini_bio = {
      image_url: settings.aboutImageUrl,
      image_alt: settings.aboutImageAlt ?? "Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges",
    };
  }

  let updated = 0;

  for (const section of homeSections) {
    const fields = imageMap[section.type];
    if (!fields) continue;

    const content = section.content as Record<string, unknown>;
    let changed = false;
    const newContent = { ...content };

    for (const [key, value] of Object.entries(fields)) {
      if (!newContent[key]) {
        newContent[key] = value;
        changed = true;
      }
    }

    if (changed) {
      await db
        .update(schema.pageSections)
        .set({ content: newContent })
        .where(eq(schema.pageSections.id, section.id));
      console.log(`Updated homepage section "${section.type}":`, Object.keys(fields).join(", "));
      updated++;
    }
  }

  // Handle bio page
  if (bioPage && settings.aboutImageUrl) {
    const bioSections = await db
      .select()
      .from(schema.pageSections)
      .where(
        and(
          eq(schema.pageSections.pageId, bioPage.id),
          eq(schema.pageSections.type, "bio"),
        )
      );

    for (const section of bioSections) {
      const content = section.content as Record<string, unknown>;
      if (!content.image_url) {
        const newContent = {
          ...content,
          image_url: settings.aboutImageUrl,
          image_alt: settings.aboutImageAlt ?? "Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges",
        };
        await db
          .update(schema.pageSections)
          .set({ content: newContent })
          .where(eq(schema.pageSections.id, section.id));
        console.log(`Updated bio page section "bio": image_url, image_alt`);
        updated++;
      }
    }
  }

  console.log(`\nDone. ${updated} section(s) updated.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
