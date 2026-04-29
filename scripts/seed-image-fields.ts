import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";
if (!url) { console.error("DATABASE_URL required"); process.exit(1); }

const sql = neon(url);
const db = drizzle(sql, { schema });

async function main() {
  const rows = await db.select().from(schema.siteSettings).limit(1);
  if (rows.length === 0) { console.log("No settings row"); return; }
  const s = rows[0];

  const updates: Record<string, string> = {};

  // Seed anatomy diagram alt if empty
  if (!s.homeAnatomyDiagramAlt) {
    updates.homeAnatomyDiagramAlt = "Labyrinthe membraneux \u2014 vestibulaire (orange) et cochl\u00e9aire (vert)";
  }

  // Set default OG image if not set — use anatomy diagram or hero as fallback
  if (!s.defaultOgImageUrl) {
    const candidate = s.homeAnatomyDiagramUrl ?? s.homeHeroImageUrl;
    if (candidate) {
      updates.defaultOgImageUrl = candidate;
    }
  }

  // Set OG alt if not set
  if (!s.defaultOgImageAlt) {
    updates.defaultOgImageAlt = "Physio-Vertige \u2014 Physioth\u00e9rapie vestibulaire \u00e0 Morges";
  }

  if (Object.keys(updates).length > 0) {
    await db.update(schema.siteSettings).set(updates).where(eq(schema.siteSettings.id, s.id));
    console.log("Updated:", Object.keys(updates).join(", "));
  } else {
    console.log("All fields already set");
  }

  // Verify
  const [check] = await db.select({
    alt: schema.siteSettings.homeAnatomyDiagramAlt,
    ogUrl: schema.siteSettings.defaultOgImageUrl,
    ogAlt: schema.siteSettings.defaultOgImageAlt,
  }).from(schema.siteSettings).limit(1);
  console.log("Anatomy alt:", check.alt);
  console.log("OG URL:", check.ogUrl);
  console.log("OG alt:", check.ogAlt);
}

main().catch((err) => { console.error(err); process.exit(1); });
