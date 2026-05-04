import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";
if (!url) { console.error("DATABASE_URL required"); process.exit(1); }

const sql = neon(url);
const db = drizzle(sql, { schema });

const QUALIFICATIONS = [
  "Diplôme en physiothérapie (2020)",
  "Formation spécialisée en dry needling (2020)",
  "Master en douleur chronique (2021)",
  "Formation VIRE vertiges (2021)",
  "Formation continue en troubles de l'équilibre et vertiges",
  "Diplôme universitaire de prise en charge clinique, paraclinique et thérapeutique des vertiges – Université de Reims (2025)",
];

async function seedSection(pageSlug: string, sectionType: string) {
  const [page] = await db.select().from(schema.pages).where(eq(schema.pages.slug, pageSlug)).limit(1);
  if (!page) { console.log(`No page "${pageSlug}"`); return; }

  const [section] = await db
    .select()
    .from(schema.pageSections)
    .where(and(
      eq(schema.pageSections.pageId, page.id),
      eq(schema.pageSections.type, sectionType),
    ))
    .limit(1);

  if (!section) { console.log(`No "${sectionType}" section on "${pageSlug}"`); return; }

  const content = section.content as Record<string, unknown>;
  const existing = content.qualifications as string[] | undefined;

  if (existing && existing.length === QUALIFICATIONS.length) {
    console.log(`"${sectionType}" on "${pageSlug}" already has ${existing.length} qualifications, skipping`);
    return;
  }

  await db
    .update(schema.pageSections)
    .set({ content: { ...content, qualifications: QUALIFICATIONS } })
    .where(eq(schema.pageSections.id, section.id));

  console.log(`Seeded ${QUALIFICATIONS.length} qualifications into "${sectionType}" on "${pageSlug}"`);
}

async function main() {
  await seedSection("/", "mini_bio");
  await seedSection("/le-physiotherapeute", "bio");
  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });
