import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices, getSiteSettings, getPageContent } from "@/db/queries";
import { SITE_URL } from "@/lib/utils";
import { ConditionCard } from "@/components/public/condition-card";
import { CTABlock } from "@/components/public/cta-block";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Vertiges traités — Conditions vestibulaires prises en charge",
  description:
    "Découvrez les pathologies vestibulaires traitées par Arnaud Canadas à Morges : VPPB, névrite vestibulaire, maladie de Ménière, migraine vestibulaire, et plus.",
  alternates: { canonical: `${SITE_URL}/vertiges-traites` },
};

export default async function VertigesTraitesPage() {
  const [services, settings, content] = await Promise.all([
    getPublishedServices(),
    getSiteSettings(),
    getPageContent("/vertiges-traites"),
  ]);
  const phone = settings?.phone ?? "+41 77 274 71 44";

  const hero = content?.get("conditions_list_hero") ?? {};
  const eyebrow = (hero.eyebrow as string) ?? "Conditions traitées";
  const h1 = (hero.h1 as string) ?? "Vertiges traités à Morges";
  const intro = (hero.intro as string) ?? "Chaque vertige a une cause spécifique et un traitement adapté. Sélectionnez votre condition pour en savoir plus.";

  const cta = content?.get("cta_fullwidth") ?? {};
  const ctaTitle = (cta.title as string) ?? "Besoin d'un avis ?";
  const ctaDescription = (cta.description as string) ?? "Contactez Arnaud Canadas pour une évaluation vestibulaire complète à Morges.";

  return (
    <>
      <section className="bg-gradient-to-b from-teal-50 to-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Accueil
            </Link>{" "}
            / <span className="text-foreground">Vertiges traités</span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
              {h1}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {intro}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ConditionCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                shortDescription={service.shortDescription}
                heroHook={service.heroHook}
              />
            ))}
          </div>
        </div>
      </section>

      <CTABlock
        variant="fullwidth"
        title={ctaTitle}
        description={ctaDescription}
        phone={phone}
      />
    </>
  );
}
