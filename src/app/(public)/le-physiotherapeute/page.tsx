import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, SITE_URL } from "@/lib/utils";
import { getSiteSettings, getPageContent } from "@/db/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Le Physiothérapeute — Arnaud Canadas",
  description:
    "Découvrez le parcours et les qualifications d'Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges, Canton de Vaud.",
  alternates: { canonical: `${SITE_URL}/le-physiotherapeute` },
};

function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arnaud Canadas",
    jobTitle: "Physiothérapeute vestibulaire",
    url: `${SITE_URL}/le-physiotherapeute`,
    worksFor: {
      "@type": "Physiotherapy",
      name: "Physio-Vertige",
      url: `${SITE_URL}`,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue de Couvaloup 16",
      addressLocality: "Morges",
      postalCode: "1110",
      addressCountry: "CH",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function PhysiotherapeutePage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getPageContent("/le-physiotherapeute"),
  ]);
  const phone = settings?.phone ?? "+41 77 274 71 44";

  const bio = content?.get("bio") ?? {};
  const aboutImageUrl = (bio.image_url as string) || settings?.aboutImageUrl;
  const aboutImageAlt =
    (bio.image_alt as string) || (settings?.aboutImageAlt ??
    "Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges");
  const eyebrow = (bio.eyebrow as string) ?? "Le physiothérapeute";
  const h1 = (bio.h1 as string) ?? "Arnaud Canadas";
  const subtitle = (bio.subtitle as string) ?? "Physiothérapeute vestibulaire spécialisé";
  const body = (bio.body as string) ?? "Passionné par la physiothérapie vestibulaire, je me suis spécialisé dans le traitement des vertiges et des troubles de l'équilibre. Mon objectif est d'offrir à chaque patient une prise en charge claire, rassurante et efficace.\n\nAprès ma formation en physiothérapie, j'ai approfondi mes connaissances dans le domaine vestibulaire à travers des formations continues spécialisées, me permettant de maîtriser les techniques les plus récentes de diagnostic et de traitement des pathologies vestibulaires.\n\nJe reçois mes patients au sein du cabinet partagé situé au centre de Morges, dans un environnement calme et adapté à la rééducation vestibulaire.";
  const qualifications = (bio.qualifications as string[]) ?? [
    "Diplôme en physiothérapie (2020)",
    "Formation spécialisée en dry needling (2020)",
    "Master en douleur chronique (2021)",
    "Formation VIRE vertiges (2021)",
    "Formation continue en troubles de l'équilibre et vertiges",
    "Diplôme universitaire de prise en charge clinique, paraclinique et thérapeutique des vertiges – Université de Reims (2025)",
  ];

  const bodyParagraphs = body.split("\n\n").filter(Boolean);

  return (
    <>
      <PersonJsonLd />
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">
              Accueil
            </a>{" "}
            / <span>Le physiothérapeute</span>
          </nav>

          <div className={aboutImageUrl ? "grid gap-10 lg:grid-cols-5" : "mx-auto max-w-2xl"}>
            {aboutImageUrl && (
              <div className="lg:col-span-2">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={aboutImageUrl}
                    alt={aboutImageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <div className={aboutImageUrl ? "lg:col-span-3" : ""}>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {eyebrow}
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                {h1}
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                {subtitle}
              </p>

              <div className="mt-6 space-y-4 text-muted-foreground">
                {bodyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold">
                Qualifications
              </h2>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                {qualifications.map((q, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {q}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-muted-foreground">
                Membre du{" "}
                <a
                  href="https://vertiges-equilibre.ch"
                  target="_blank"
                  rel="external noopener"
                  className="text-primary underline underline-offset-2 hover:text-primary/80"
                >
                  Groupement Romand des Physiothérapeutes Vestibulaires (GRPV)
                </a>
                , un réseau professionnel de spécialistes en rééducation vestibulaire en Suisse romande.
              </p>

              <a href={`tel:${phone.replace(/\s/g, "")}`} className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
                <Phone className="mr-2 h-5 w-5" />
                Prendre rendez-vous
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
