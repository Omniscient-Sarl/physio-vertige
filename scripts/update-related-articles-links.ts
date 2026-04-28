import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

const sql = neon(process.env.DATABASE_URL as string);
const db = drizzle(sql, { schema });

// Map of article title fragments → slug (for fuzzy matching)
const ARTICLE_MAP: Array<{ keywords: string[]; slug: string; title: string }> = [
  {
    keywords: ["vppb", "manoeuvre", "epley", "manœuvre"],
    slug: "vppb-traitement-manoeuvre-epley-morges",
    title: "VPPB : symptômes, causes et traitement par la manœuvre d'Epley à Morges",
  },
  {
    keywords: ["7 signes", "origine vestibulaire", "comment savoir"],
    slug: "vertiges-origine-vestibulaire-signes-alerte-morges",
    title: "Comment savoir si mes vertiges sont d'origine vestibulaire ? 7 signes qui doivent vous alerter",
  },
  {
    keywords: ["migraine vestibulaire", "sous-diagnostiquée"],
    slug: "migraine-vestibulaire-comprendre-traiter-morges",
    title: "Migraine vestibulaire : la cause de vertige la plus sous-diagnostiquée — comprendre et traiter",
  },
  {
    keywords: ["5 exercices", "exercices à faire", "rééducation vestibulaire"],
    slug: "reeducation-vestibulaire-exercices-maison-morges",
    title: "Rééducation vestibulaire : 5 exercices à faire chez soi",
  },
  {
    keywords: ["commotion", "traumatisme crânien", "post-traumatique"],
    slug: "vertige-post-commotion-traumatisme-cranien-morges",
    title: "Vertiges après une commotion ou un traumatisme crânien",
  },
];

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function findMatchingSlug(line: string): { slug: string; title: string } | null {
  const normalized = stripAccents(line.toLowerCase());
  for (const article of ARTICLE_MAP) {
    if (article.keywords.some((kw) => normalized.includes(stripAccents(kw.toLowerCase())))) {
      return { slug: article.slug, title: article.title };
    }
  }
  return null;
}

async function run() {
  const posts = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.status, "published"));

  for (const post of posts) {
    if (!post.content) continue;

    // Find the "Articles liés" section
    const articlesLiesMatch = post.content.match(/(## Articles liés.*\n\n)([\s\S]*?)(?=\n## |\n$|$)/i);
    if (!articlesLiesMatch) continue;

    const sectionHeader = articlesLiesMatch[1];
    const sectionBody = articlesLiesMatch[2];
    const lines = sectionBody.split("\n");
    let changed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;
      // Skip if already a markdown link
      if (line.includes("[") && line.includes("](/blog/")) continue;

      // Strip bullet prefix and "(à venir)" suffix
      const cleaned = line.replace(/^-\s*/, "").replace(/\s*\(à venir\)\s*$/, "").trim();
      const match = findMatchingSlug(cleaned);
      if (match && match.slug !== post.slug) {
        lines[i] = `- [${cleaned}](/blog/${match.slug})`;
        changed = true;
      }
    }

    if (changed) {
      // Strip "(à venir)" from the section header too
      const newHeader = sectionHeader.replace(/\s*\(à venir\)/, "");
      const newSection = newHeader + lines.join("\n");
      const newContent = post.content.replace(articlesLiesMatch[0], newSection);

      await db
        .update(schema.blogPosts)
        .set({ content: newContent, updatedAt: new Date() })
        .where(eq(schema.blogPosts.id, post.id));

      console.log(`Updated internal links for: ${post.slug}`);
    } else {
      console.log(`No changes needed for: ${post.slug}`);
    }
  }

  console.log("\nDone. All articles now have internal links.");
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
