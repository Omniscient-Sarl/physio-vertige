import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSiteSettings } from "@/db/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Le Physiothérapeute — Arnaud Canadas",
  description:
    "Découvrez le parcours et les qualifications d'Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges, Canton de Vaud.",
  alternates: { canonical: "https://physio-vertige.ch/le-physiotherapeute" },
};

function PersonJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Arnaud Canadas",
    jobTitle: "Physiothérapeute vestibulaire",
    url: "https://physio-vertige.ch/le-physiotherapeute",
    worksFor: {
      "@type": "Physiotherapy",
      name: "Physio-Vertige",
      url: "https://physio-vertige.ch",
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
  const settings = await getSiteSettings();
  const aboutImageUrl = settings?.aboutImageUrl;
  const aboutImageAlt =
    settings?.aboutImageAlt ??
    "Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges";

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
                Le physiothérapeute
              </p>
              <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                Arnaud Canadas
              </h1>
              <p className="mt-1 text-lg text-muted-foreground">
                Physiothérapeute vestibulaire spécialisé
              </p>

              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  Passionné par la physiothérapie vestibulaire, je me suis
                  spécialisé dans le traitement des vertiges et des troubles de
                  l&apos;équilibre. Mon objectif est d&apos;offrir à chaque
                  patient une prise en charge claire, rassurante et efficace.
                </p>
                <p>
                  Après ma formation en physiothérapie, j&apos;ai approfondi mes
                  connaissances dans le domaine vestibulaire à travers des
                  formations continues spécialisées, me permettant de maîtriser
                  les techniques les plus récentes de diagnostic et de traitement
                  des pathologies vestibulaires.
                </p>
                <p>
                  Je reçois mes patients au sein du cabinet partagé situé au
                  centre de Morges, dans un environnement calme et adapté à la
                  rééducation vestibulaire.
                </p>
              </div>

              <h2 className="mt-8 font-heading text-xl font-semibold">
                Qualifications
              </h2>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  Diplôme en physiothérapie
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  Formation spécialisée en rééducation vestibulaire
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  Formation continue en troubles de l&apos;équilibre et vertiges
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  Membre de Physioswiss
                </li>
              </ul>

              <a href="tel:+41772747144" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
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
