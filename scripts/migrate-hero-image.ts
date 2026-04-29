import { UTApi } from "uploadthing/server";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import * as fs from "fs";
import * as path from "path";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";
if (!url) { console.error("DATABASE_URL required"); process.exit(1); }

const sql = neon(url);
const db = drizzle(sql, { schema });
const utapi = new UTApi();

async function main() {
  const filePath = path.join(process.cwd(), "public/images/hero-vestibular-system.jpg");
  const fileBuffer = fs.readFileSync(filePath);
  const file = new File([fileBuffer], "hero-vestibular-system.jpg", { type: "image/jpeg" });

  console.log("Uploading to UploadThing...");
  const response = await utapi.uploadFiles(file);

  if (response.error) {
    console.error("Upload failed:", response.error);
    process.exit(1);
  }

  const uploadedUrl = response.data.ufsUrl;
  const uploadedKey = response.data.key;
  console.log("Uploaded:", uploadedUrl);

  // Insert media row
  await db.insert(schema.media).values({
    uploadthingUrl: uploadedUrl,
    uploadthingKey: uploadedKey,
    altText: "Illustration du systeme vestibulaire de l'oreille interne",
    width: 1280,
    height: 720,
  });
  console.log("Inserted media row");

  // Update site_settings.homeHeroImageUrl
  const existing = await db.select().from(schema.siteSettings).limit(1);
  if (existing.length > 0) {
    await db
      .update(schema.siteSettings)
      .set({ homeHeroImageUrl: uploadedUrl })
      .where(eq(schema.siteSettings.id, existing[0].id));
    console.log("Updated site_settings.homeHeroImageUrl");
  } else {
    console.log("No site_settings row found — creating one");
    await db.insert(schema.siteSettings).values({
      siteName: "Physio-Vertige",
      homeHeroImageUrl: uploadedUrl,
    });
  }

  console.log("Done! Hero image migrated to UploadThing.");
}

main().catch((err) => { console.error(err); process.exit(1); });
