/**
 * Seeds page_sections with all editorial content currently hardcoded in components.
 * Safe to run multiple times — deletes existing sections for each page before inserting.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? "";
if (!url) { console.error("DATABASE_URL required"); process.exit(1); }

const sql = neon(url);
const db = drizzle(sql, { schema });

async function getOrCreatePage(slug: string, title: string): Promise<number> {
  const rows = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug));
  if (rows.length > 0) return rows[0].id;
  const [inserted] = await db.insert(schema.pages).values({ slug, title, status: "published" }).returning({ id: schema.pages.id });
  return inserted.id;
}

async function seedPage(slug: string, title: string, sections: Array<{ type: string; content: Record<string, unknown> }>) {
  const pageId = await getOrCreatePage(slug, title);
  // Clear existing sections
  await db.delete(schema.pageSections).where(eq(schema.pageSections.pageId, pageId));
  // Insert new sections
  for (let i = 0; i < sections.length; i++) {
    await db.insert(schema.pageSections).values({
      pageId,
      order: i,
      type: sections[i].type,
      content: sections[i].content,
    });
  }
  console.log(`  ${slug}: ${sections.length} sections`);
}

async function main() {
  console.log("Seeding editorial content...\n");

  // ── Homepage ──
  await seedPage("/", "Accueil", [
    {
      type: "hero",
      content: {
        h1: "Retrouvez votre \u00e9quilibre.",
        subhead: "Physioth\u00e9rapie vestibulaire sp\u00e9cialis\u00e9e \u00e0 Morges.\nArnaud Canadas vous accompagne pour traiter vos vertiges avec une approche experte et rassurante.",
      },
    },
    {
      type: "conditions_grid",
      content: {
        eyebrow: "Diagnostic",
        h2: "Quel type de vertige avez-vous\u00a0?",
        body: "Chaque vertige a une cause sp\u00e9cifique et un traitement adapt\u00e9. Identifiez votre situation et d\u00e9couvrez comment je peux vous aider.",
      },
    },
    {
      type: "anatomy",
      content: {
        eyebrow: "Comprendre",
        h2: "L\u2019oreille interne, votre centre de l\u2019\u00e9quilibre",
        body: "Au c\u0153ur de chaque oreille interne se trouvent deux syst\u00e8mes\u00a0: la cochl\u00e9e, qui traite les sons, et le syst\u00e8me vestibulaire, qui informe en permanence votre cerveau de la position et des mouvements de votre t\u00eate. Lorsque ce dernier dysfonctionne, vous ressentez des vertiges, des naus\u00e9es ou une instabilit\u00e9.\n\nComprendre quelle structure est en cause permet de cibler la r\u00e9\u00e9ducation. Lors de la premi\u00e8re consultation, Arnaud Canadas r\u00e9alise des tests positionnels pr\u00e9cis pour identifier la zone exacte responsable de vos sympt\u00f4mes \u2014 souvent en une seule s\u00e9ance.",
      },
    },
    {
      type: "process_timeline",
      content: {
        eyebrow: "Prise en charge",
        h2: "Comment se d\u00e9roule votre traitement\u00a0?",
        steps: [
          { title: "\u00c9valuation", description: "Bilan complet\u00a0: tests oculomoteurs, man\u0153uvres positionnelles, analyse de l\u2019\u00e9quilibre et de la marche." },
          { title: "Diagnostic", description: "Identification pr\u00e9cise du type de vertige et de son origine pour un traitement cibl\u00e9." },
          { title: "Traitement", description: "Man\u0153uvres de repositionnement, r\u00e9\u00e9ducation vestibulaire, exercices d\u2019habituation personnalis\u00e9s." },
          { title: "Suivi", description: "Programme d\u2019exercices \u00e0 domicile et s\u00e9ances de contr\u00f4le pour une gu\u00e9rison durable." },
        ],
      },
    },
    {
      type: "cta_card",
      content: {
        title: "Pr\u00eat \u00e0 retrouver votre \u00e9quilibre\u00a0?",
        description: "Un bilan vestibulaire permet d\u2019identifier la cause de vos vertiges et de commencer le traitement adapt\u00e9 d\u00e8s la premi\u00e8re s\u00e9ance.",
      },
    },
    {
      type: "testimonials",
      content: {
        eyebrow: "T\u00e9moignages",
        h2: "Ce que disent nos patients",
      },
    },
    {
      type: "mini_bio",
      content: {
        eyebrow: "Votre th\u00e9rapeute",
        h2: "Arnaud Canadas",
        body: "Physioth\u00e9rapeute sp\u00e9cialis\u00e9 en r\u00e9\u00e9ducation vestibulaire, Arnaud Canadas accompagne depuis plus de 10 ans les patients souffrant de vertiges et troubles de l\u2019\u00e9quilibre. Form\u00e9 aux derni\u00e8res techniques de diagnostic et de traitement, il offre une prise en charge compl\u00e8te et personnalis\u00e9e.",
      },
    },
    {
      type: "blog_teaser",
      content: {
        eyebrow: "Blog",
        h2: "Comprendre les vertiges",
      },
    },
    {
      type: "faq",
      content: {
        eyebrow: "FAQ",
        h2: "Questions fr\u00e9quentes",
      },
    },
    {
      type: "cta_fullwidth",
      content: {
        title: "Prendre rendez-vous",
        description: "N\u2019h\u00e9sitez pas \u00e0 me contacter pour toute question ou pour fixer un rendez-vous.",
      },
    },
  ]);

  // ── Bio page ──
  await seedPage("/le-physiotherapeute", "Le Physioth\u00e9rapeute \u2014 Arnaud Canadas", [
    {
      type: "bio",
      content: {
        eyebrow: "Le physioth\u00e9rapeute",
        h1: "Arnaud Canadas",
        subtitle: "Physioth\u00e9rapeute vestibulaire sp\u00e9cialis\u00e9",
        body: "Passionn\u00e9 par la physioth\u00e9rapie vestibulaire, je me suis sp\u00e9cialis\u00e9 dans le traitement des vertiges et des troubles de l\u2019\u00e9quilibre. Mon objectif est d\u2019offrir \u00e0 chaque patient une prise en charge claire, rassurante et efficace.\n\nApr\u00e8s ma formation en physioth\u00e9rapie, j\u2019ai approfondi mes connaissances dans le domaine vestibulaire \u00e0 travers des formations continues sp\u00e9cialis\u00e9es, me permettant de ma\u00eetriser les techniques les plus r\u00e9centes de diagnostic et de traitement des pathologies vestibulaires.\n\nJe re\u00e7ois mes patients au sein du cabinet partag\u00e9 situ\u00e9 au centre de Morges, dans un environnement calme et adapt\u00e9 \u00e0 la r\u00e9\u00e9ducation vestibulaire.",
        qualifications: [
          "Dipl\u00f4me en physioth\u00e9rapie",
          "Formation sp\u00e9cialis\u00e9e en r\u00e9\u00e9ducation vestibulaire",
          "Formation continue en troubles de l\u2019\u00e9quilibre et vertiges",
          "Membre de Physioswiss",
        ],
      },
    },
  ]);

  // ── Contact page ──
  await seedPage("/contact", "Contact \u2014 Prendre rendez-vous", [
    {
      type: "contact_hero",
      content: {
        eyebrow: "Contact",
        h1: "Prendre rendez-vous",
        intro: "N\u2019h\u00e9sitez pas \u00e0 me contacter pour toute question ou pour fixer un rendez-vous. Je vous r\u00e9pondrai dans les meilleurs d\u00e9lais.",
      },
    },
  ]);

  // ── Cabinet page ──
  await seedPage("/cabinet", "Cabinet partag\u00e9 \u2014 Morges", [
    {
      type: "cabinet",
      content: {
        eyebrow: "Cabinet",
        h1: "Cabinet partag\u00e9 \u00e0 Morges",
        body: "Je re\u00e7ois mes patients au sein d\u2019un cabinet partag\u00e9 situ\u00e9 au c\u0153ur de Morges, dans un environnement calme et professionnel, id\u00e9al pour la r\u00e9\u00e9ducation vestibulaire.\n\nLe cabinet est \u00e9quip\u00e9 du mat\u00e9riel n\u00e9cessaire pour r\u00e9aliser les \u00e9valuations vestibulaires et les exercices de r\u00e9\u00e9ducation dans les meilleures conditions.\n\nFacilement accessible en transports publics et en voiture, le cabinet dispose de places de parking \u00e0 proximit\u00e9.",
        linkTitle: "Lien vers le site du cabinet",
        linkUrl: "",
      },
    },
  ]);

  // ── Vertiges traites list page ──
  await seedPage("/vertiges-traites", "Vertiges trait\u00e9s \u2014 Pathologies vestibulaires", [
    {
      type: "conditions_list_hero",
      content: {
        eyebrow: "Conditions trait\u00e9es",
        h1: "Vertiges trait\u00e9s \u00e0 Morges",
        intro: "Chaque vertige a une cause sp\u00e9cifique et un traitement adapt\u00e9. S\u00e9lectionnez votre condition pour en savoir plus.",
      },
    },
    {
      type: "cta_fullwidth",
      content: {
        title: "Besoin d\u2019un avis\u00a0?",
        description: "Contactez Arnaud Canadas pour une \u00e9valuation vestibulaire compl\u00e8te \u00e0 Morges.",
      },
    },
  ]);

  // ── Blog list page ──
  await seedPage("/blog", "Blog \u2014 Articles sur les vertiges et l\u2019\u00e9quilibre", [
    {
      type: "blog_list_hero",
      content: {
        eyebrow: "Blog",
        h1: "Comprendre les vertiges",
        intro: "Articles, conseils et actualit\u00e9s sur les vertiges et la r\u00e9\u00e9ducation vestibulaire.",
      },
    },
  ]);

  // ── Blog article template fields (stored on blog list page for convenience) ──
  // author bio fields are global — store them in site_settings instead
  const settings = await db.select().from(schema.siteSettings).limit(1);
  if (settings.length > 0) {
    // We can't add arbitrary columns easily, so we'll handle author bio
    // via the existing page_sections on the /blog page
    await db.insert(schema.pageSections).values({
      pageId: (await db.select({ id: schema.pages.id }).from(schema.pages).where(eq(schema.pages.slug, "/blog")))[0].id,
      order: 1,
      type: "author_bio",
      content: {
        byline: "Physioth\u00e9rapeute vestibulaire",
        subtitle: "Physioth\u00e9rapeute sp\u00e9cialis\u00e9 en r\u00e9\u00e9ducation vestibulaire",
        body: "Arnaud Canadas accompagne depuis plus de 10 ans les patients souffrant de vertiges et troubles de l\u2019\u00e9quilibre. Form\u00e9 aux derni\u00e8res techniques de diagnostic vestibulaire, il exerce \u00e0 Morges, Canton de Vaud.",
      },
    });
  }

  // ── Mentions legales ──
  await seedPage("/mentions-legales", "Mentions l\u00e9gales", [
    {
      type: "markdown_body",
      content: {
        body: `## \u00c9diteur du site

Arnaud Canadas
Physioth\u00e9rapeute vestibulaire
Rue de Couvaloup 16
1110 Morges, Suisse
Email\u00a0: info@physio-vertige.ch
T\u00e9l\u00e9phone\u00a0: +41 77 274 71 44

## H\u00e9bergement

Ce site est h\u00e9berg\u00e9 par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, \u00c9tats-Unis.

## Propri\u00e9t\u00e9 intellectuelle

L\u2019ensemble du contenu de ce site (textes, images, graphismes, logo, ic\u00f4nes) est la propri\u00e9t\u00e9 exclusive d\u2019Arnaud Canadas, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation pr\u00e9alable est interdite.

## Responsabilit\u00e9

Les informations fournies sur ce site sont \u00e0 titre informatif uniquement et ne constituent pas un avis m\u00e9dical. Consultez toujours un professionnel de sant\u00e9 qualifi\u00e9 pour tout probl\u00e8me m\u00e9dical.`,
      },
    },
  ]);

  // ── Politique de confidentialite ──
  await seedPage("/politique-de-confidentialite", "Politique de confidentialit\u00e9", [
    {
      type: "markdown_body",
      content: {
        body: `## Collecte des donn\u00e9es

Nous collectons les donn\u00e9es personnelles que vous nous fournissez volontairement via le formulaire de contact\u00a0: nom, adresse email, num\u00e9ro de t\u00e9l\u00e9phone (optionnel) et le contenu de votre message.

## Utilisation des donn\u00e9es

Vos donn\u00e9es sont utilis\u00e9es exclusivement pour r\u00e9pondre \u00e0 votre demande de contact et, le cas \u00e9ch\u00e9ant, pour la prise de rendez-vous. Elles ne sont jamais vendues, partag\u00e9es ou transmises \u00e0 des tiers.

## Conservation des donn\u00e9es

Les donn\u00e9es collect\u00e9es via le formulaire de contact sont conserv\u00e9es pour la dur\u00e9e n\u00e9cessaire au traitement de votre demande, puis supprim\u00e9es dans un d\u00e9lai raisonnable.

## Vos droits

Conform\u00e9ment \u00e0 la Loi f\u00e9d\u00e9rale sur la protection des donn\u00e9es (LPD) et au R\u00e8glement g\u00e9n\u00e9ral sur la protection des donn\u00e9es (RGPD), vous disposez d\u2019un droit d\u2019acc\u00e8s, de rectification et de suppression de vos donn\u00e9es personnelles. Pour exercer ces droits, contactez-nous \u00e0 info@physio-vertige.ch.

## Cookies

Ce site utilise des cookies techniques n\u00e9cessaires \u00e0 son bon fonctionnement. Aucun cookie de suivi ou publicitaire n\u2019est utilis\u00e9.

## Contact

Pour toute question relative \u00e0 la protection de vos donn\u00e9es\u00a0:
Arnaud Canadas \u2014 info@physio-vertige.ch`,
      },
    },
  ]);

  console.log("\n\u2705 Editorial content seeded!");
}

main().catch((err) => { console.error(err); process.exit(1); });
