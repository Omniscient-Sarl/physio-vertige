import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import * as fs from "fs";
import * as path from "path";

const url =
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL ??
  "";

if (!url) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(url);
const db = drizzle(sql, { schema });

interface ScrapedSection {
  type: string;
  label?: string;
  heading?: string;
  body?: string;
  body2?: string;
  footer?: string;
  cta?: { text: string; url: string };
  image?: { src: string; alt: string; width: number; height: number };
  items?: Array<{
    icon?: string;
    title: string;
    description: string;
    slug?: string;
  }>;
  alert?: { heading: string; items: string[] };
  steps?: Array<{ title: string; description: string }>;
  contacts?: Array<{ type: string; value: string; url: string }>;
}

interface ScrapedPage {
  slug: string;
  title: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  sections: ScrapedSection[];
}

interface ScrapedContent {
  pages: ScrapedPage[];
  globalContacts: {
    phone: string;
    email: string;
    address: string;
    hours: string;
    googleVerification?: string;
  };
}

async function seed() {
  console.log("Seeding database...\n");

  const contentPath = path.join(process.cwd(), "scraped", "site-content.json");
  const content: ScrapedContent = JSON.parse(
    fs.readFileSync(contentPath, "utf-8")
  );

  // Clear tables in reverse FK order
  await db.delete(schema.pageSections);
  await db.delete(schema.pages);
  await db.delete(schema.services);
  await db.delete(schema.blogPosts);
  await db.delete(schema.testimonials);
  await db.delete(schema.faqs);
  await db.delete(schema.media);
  await db.delete(schema.siteSettings);

  // 1. Site settings
  await db.insert(schema.siteSettings).values({
    siteName: "Physio-Vertige",
    tagline: "Physiothérapie vestibulaire · Morges",
    phone: content.globalContacts.phone,
    email: content.globalContacts.email,
    contactEmail: content.globalContacts.email,
    address: content.globalContacts.address,
    openingHours: {
      "Lundi - Vendredi": "08h00 - 19h00",
      note: "Sur rendez-vous uniquement",
    },
    socialLinks: {},
    googleVerification: content.globalContacts.googleVerification ?? "",
  });
  console.log("✓ site_settings: 1 row");

  // 2. Media (hero image)
  await db.insert(schema.media).values({
    uploadthingUrl: "/images/hero-vestibular-system.jpg",
    uploadthingKey: "seed-hero",
    altText:
      "Illustration du système vestibulaire de l'oreille interne",
    width: 1280,
    height: 720,
  });
  console.log("✓ media: 1 row");

  // 3. Pages + sections from scraped content
  let totalSections = 0;
  for (const page of content.pages) {
    const [inserted] = await db
      .insert(schema.pages)
      .values({
        slug: page.slug,
        title: page.title,
        metaTitle: page.ogTitle ?? page.title,
        metaDescription: page.metaDescription,
        status: "published",
      })
      .returning({ id: schema.pages.id });

    for (let i = 0; i < page.sections.length; i++) {
      const section = page.sections[i];
      await db.insert(schema.pageSections).values({
        pageId: inserted.id,
        order: i,
        type: section.type,
        content: section as unknown as Record<string, unknown>,
        imageUrl: section.image?.src
          ? `/images/${section.image.src}`
          : null,
      });
      totalSections++;
    }
  }

  // Additional pages
  const additionalPages = [
    {
      slug: "/le-physiotherapeute",
      title: "Le Physiothérapeute — Arnaud Canadas",
      metaTitle: "Le Physiothérapeute — Arnaud Canadas",
      metaDescription:
        "Découvrez le parcours et les qualifications d'Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges.",
    },
    {
      slug: "/vertiges-traites",
      title: "Vertiges traités — Pathologies vestibulaires",
      metaTitle: "Vertiges traités — Pathologies vestibulaires",
      metaDescription:
        "Découvrez les pathologies vestibulaires traitées : VPPB, maladie de Ménière, déficit vestibulaire, presbyvestibulie, PPPD.",
    },
    {
      slug: "/blog",
      title: "Blog — Articles sur les vertiges et l'équilibre",
      metaTitle: "Blog — Articles sur les vertiges et l'équilibre",
      metaDescription:
        "Articles et conseils sur les vertiges, troubles de l'équilibre et la rééducation vestibulaire.",
    },
    {
      slug: "/cabinet",
      title: "Cabinet partagé — Morges",
      metaTitle: "Cabinet partagé — Morges",
      metaDescription:
        "Découvrez le cabinet de physiothérapie partagé situé au centre de Morges.",
    },
    {
      slug: "/contact",
      title: "Contact — Prendre rendez-vous",
      metaTitle: "Contact — Prendre rendez-vous",
      metaDescription:
        "Contactez Arnaud Canadas, physiothérapeute vestibulaire à Morges.",
    },
    {
      slug: "/mentions-legales",
      title: "Mentions légales",
      metaTitle: "Mentions légales",
      metaDescription: "Mentions légales du site Physio-Vertige.",
    },
    {
      slug: "/politique-de-confidentialite",
      title: "Politique de confidentialité",
      metaTitle: "Politique de confidentialité",
      metaDescription:
        "Politique de confidentialité du site Physio-Vertige.",
    },
  ];

  for (const p of additionalPages) {
    await db.insert(schema.pages).values({ ...p, status: "published" });
  }
  console.log(`✓ pages: ${content.pages.length + additionalPages.length} rows`);
  console.log(`✓ page_sections: ${totalSections} rows`);

  // 4. Services
  const servicesData = [
    {
      slug: "vppb",
      title: "VPPB — Vertige Positionnel Paroxystique Bénin",
      shortDescription:
        "Courts épisodes de vertiges causés par le déplacement de cristaux dans l'oreille interne.",
      longDescription:
        "Le Vertige Positionnel Paroxystique Bénin (VPPB) est la cause la plus fréquente de vertiges d'origine vestibulaire. Il est provoqué par le déplacement de petits cristaux de carbonate de calcium (otolithes) dans les canaux semi-circulaires de l'oreille interne.\n\nLes symptômes typiques incluent de brefs épisodes de vertiges rotatoires intenses déclenchés par les changements de position de la tête.\n\nLe traitement repose sur des manœuvres de repositionnement spécifiques avec un taux de succès supérieur à 90% en 1 à 3 séances.",
      iconName: "crystal",
      order: 0,
    },
    {
      slug: "deficit-vestibulaire",
      title: "Déficit vestibulaire périphérique",
      shortDescription:
        "Perte de fonction d'un vestibule suite à une infection virale ou un problème circulatoire.",
      longDescription:
        "Le déficit vestibulaire périphérique résulte d'une perte de fonction d'un ou des deux vestibules. La cause la plus fréquente est la névrite vestibulaire.\n\nLa rééducation vestibulaire joue un rôle essentiel dans la récupération en stimulant la compensation centrale.",
      iconName: "nerve",
      order: 1,
    },
    {
      slug: "maladie-de-meniere",
      title: "Maladie de Ménière",
      shortDescription:
        "Vertiges associés à des troubles auditifs, acouphènes et sensation de plénitude auriculaire.",
      longDescription:
        "La maladie de Ménière est une affection chronique de l'oreille interne caractérisée par des crises récurrentes de vertiges rotatoires.\n\nBien que la physiothérapie vestibulaire ne traite pas la cause, elle joue un rôle important dans la gestion de l'instabilité entre les crises.",
      iconName: "ear-waves",
      order: 2,
    },
    {
      slug: "presbyvestibulie",
      title: "Presbyvestibulie",
      shortDescription:
        "Déclin progressif de la fonction vestibulaire lié au vieillissement.",
      longDescription:
        "La presbyvestibulie désigne le déclin progressif de la fonction vestibulaire lié au vieillissement.\n\nLa rééducation vestibulaire est particulièrement efficace pour cette population, permettant de stimuler les mécanismes de compensation.",
      iconName: "aging",
      order: 3,
    },
    {
      slug: "pppd",
      title: "PPPD — Persistent Postural-Perceptual Dizziness",
      shortDescription:
        "Vertiges chroniques et instabilité persistante.",
      longDescription:
        "Le PPPD est un trouble vestibulaire fonctionnel caractérisé par une sensation de vertige ou d'instabilité persistante pendant au moins 3 mois.\n\nLa rééducation vestibulaire est le traitement de première ligne, reposant sur une désensibilisation progressive.",
      iconName: "chronic",
      order: 4,
    },
    {
      slug: "causes-neurologiques",
      title: "Causes neurologiques",
      shortDescription:
        "Sclérose en plaques, AVC, migraine vestibulaire, etc.",
      longDescription:
        "Certains vertiges ont une origine centrale. Les causes neurologiques incluent la migraine vestibulaire, les AVC, la sclérose en plaques.\n\nUne évaluation approfondie est indispensable pour orienter le patient vers la prise en charge la plus adaptée.",
      iconName: "brain",
      order: 5,
    },
  ];

  for (const s of servicesData) {
    await db.insert(schema.services).values({ ...s, published: true });
  }
  console.log(`✓ services: ${servicesData.length} rows`);

  // 5. Blog posts
  await db.insert(schema.blogPosts).values({
    slug: "comprendre-le-vppb-vertiges-positionnels",
    title:
      "Comprendre le VPPB : tout savoir sur les vertiges positionnels",
    metaTitle:
      "Comprendre le VPPB : tout savoir sur les vertiges positionnels",
    metaDescription:
      "Découvrez le VPPB : causes, symptômes et traitements. Guide complet par un physiothérapeute vestibulaire.",
    excerpt:
      "Le VPPB est la cause la plus fréquente de vertiges. Découvrez ses symptômes, ses causes et les traitements efficaces.",
    content: `Le Vertige Positionnel Paroxystique Bénin (VPPB) est le trouble vestibulaire le plus fréquent. Il représente environ 30% de tous les cas de vertiges vus en consultation.

## Qu'est-ce que le VPPB ?

Le VPPB est causé par le déplacement de petits cristaux de carbonate de calcium, appelés otolithes, dans les canaux semi-circulaires de l'oreille interne.

## Les symptômes caractéristiques

Les symptômes du VPPB sont très reconnaissables : des épisodes brefs de vertiges rotatoires intenses, déclenchés par les changements de position de la tête.

## Le diagnostic

Le diagnostic repose sur des tests positionnels spécifiques. Le test de Dix-Hallpike est le plus utilisé pour détecter un VPPB du canal postérieur.

## Le traitement

Le traitement repose sur des manœuvres de repositionnement. La manœuvre d'Epley a un taux de succès supérieur à 90% en 1 à 3 séances.

## Prévention des récidives

Le VPPB a tendance à récidiver chez environ 30 à 50% des patients. Maintenir un bon apport en vitamine D et calcium aide à réduire le risque.`,
    publishedAt: new Date("2026-04-15"),
    status: "published",
    author: "Arnaud Canadas",
    tags: ["VPPB", "Vertiges", "Traitement"],
  });
  console.log("✓ blog_posts: 1 row");

  // 6. Testimonials
  const testimonialsData = [
    {
      authorName: "Marie L.",
      content:
        "Après des mois de vertiges, une seule séance avec Arnaud a suffi pour résoudre mon VPPB. Un vrai soulagement !",
      rating: 5,
      order: 0,
    },
    {
      authorName: "Pierre D.",
      content:
        "Très professionnel et rassurant. Les exercices de rééducation m'ont permis de retrouver mon équilibre en quelques semaines.",
      rating: 5,
      order: 1,
    },
    {
      authorName: "Sophie M.",
      content:
        "Je recommande vivement. Arnaud prend le temps d'expliquer et adapte le traitement à chaque séance.",
      rating: 5,
      order: 2,
    },
  ];

  for (const t of testimonialsData) {
    await db.insert(schema.testimonials).values({ ...t, published: true });
  }
  console.log(`✓ testimonials: ${testimonialsData.length} rows`);

  // 7. FAQs
  const faqsData = [
    {
      question: "Qu'est-ce que la physiothérapie vestibulaire ?",
      answer:
        "La physiothérapie vestibulaire est une spécialisation qui traite les troubles de l'équilibre et les vertiges liés au système vestibulaire (oreille interne). Elle utilise des techniques spécifiques comme les manœuvres de repositionnement et des exercices de rééducation.",
      category: "Général",
      order: 0,
    },
    {
      question: "Combien de séances sont nécessaires ?",
      answer:
        "Le nombre de séances varie selon la pathologie. Pour un VPPB, 1 à 3 séances suffisent souvent. Pour un déficit vestibulaire, le traitement peut nécessiter 6 à 12 séances.",
      category: "Traitement",
      order: 1,
    },
    {
      question: "Faut-il une ordonnance médicale ?",
      answer:
        "En Suisse, une prescription médicale est nécessaire pour que les séances soient remboursées par l'assurance maladie de base (LAMal).",
      category: "Pratique",
      order: 2,
    },
    {
      question: "Les séances sont-elles remboursées ?",
      answer:
        "Oui, avec une ordonnance médicale, les séances sont prises en charge par l'assurance de base (LAMal), sous réserve de la franchise et de la quote-part.",
      category: "Pratique",
      order: 3,
    },
  ];

  for (const f of faqsData) {
    await db.insert(schema.faqs).values({ ...f, published: true });
  }
  console.log(`✓ faqs: ${faqsData.length} rows`);

  console.log("\n✅ Seed complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
