import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Vertiges traités — Pathologies vestibulaires",
  description:
    "Découvrez les pathologies vestibulaires traitées : VPPB, maladie de Ménière, déficit vestibulaire, presbyvestibulie, PPPD et causes neurologiques.",
  alternates: { canonical: "https://physio-vertige.ch/vertiges-traites" },
};

const services = [
  {
    slug: "vppb",
    title: "VPPB — Vertige Positionnel Paroxystique Bénin",
    short:
      "Courts épisodes de vertiges causés par le déplacement de cristaux (otolithes) dans les canaux semi-circulaires de l'oreille interne.",
  },
  {
    slug: "deficit-vestibulaire",
    title: "Déficit vestibulaire périphérique",
    short:
      "Perte de fonction d'un vestibule suite à une infection virale (névrite vestibulaire) ou un problème circulatoire.",
  },
  {
    slug: "maladie-de-meniere",
    title: "Maladie de Ménière",
    short:
      "Crises de vertiges rotatoires associées à une perte auditive, des acouphènes et une sensation de plénitude dans l'oreille.",
  },
  {
    slug: "presbyvestibulie",
    title: "Presbyvestibulie",
    short:
      "Déclin progressif de la fonction vestibulaire lié au vieillissement, entraînant instabilité et risque de chutes.",
  },
  {
    slug: "pppd",
    title: "PPPD — Persistent Postural-Perceptual Dizziness",
    short:
      "Vertiges chroniques et instabilité persistante, souvent déclenchés par un épisode vestibulaire aigu ou un stress.",
  },
  {
    slug: "causes-neurologiques",
    title: "Causes neurologiques",
    short:
      "Vertiges d'origine centrale liés à des pathologies comme la sclérose en plaques, les AVC ou les migraines vestibulaires.",
  },
];

export default function VertigesTraitesPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Accueil
          </a>{" "}
          / <span>Vertiges traités</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Pathologies
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
          Vertiges traités
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Prise en charge spécialisée des troubles vestibulaires les plus
          courants. Chaque pathologie nécessite une approche diagnostique et
          thérapeutique adaptée.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/vertiges-traites/${service.slug}`}
              className="group"
            >
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardContent className="flex h-full flex-col p-6">
                  <h2 className="font-heading text-lg font-semibold group-hover:text-primary">
                    {service.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">
                    {service.short}
                  </p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                    En savoir plus
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
