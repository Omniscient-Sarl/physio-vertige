import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, SITE_URL } from "@/lib/utils";
import { getSiteSettings, getPageContent } from "@/db/queries";

export const metadata: Metadata = {
  title: "Cabinet partagé — Morges",
  description:
    "Découvrez le cabinet de physiothérapie partagé situé au centre de Morges, Canton de Vaud.",
  alternates: { canonical: `${SITE_URL}/cabinet` },
};

export const revalidate = 60;

export default async function CabinetPage() {
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getPageContent("/cabinet"),
  ]);
  const phone = settings?.phone ?? "+41 77 274 71 44";
  const address = settings?.address ?? "Rue de Couvaloup 16\n1110 Morges";
  const googleMapsUrl = settings?.googleMapsUrl ?? "https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges";
  const phoneTel = `tel:${phone.replace(/\s/g, "")}`;

  const cabinet = content?.get("cabinet") ?? {};
  const eyebrow = (cabinet.eyebrow as string) ?? "Cabinet";
  const h1 = (cabinet.h1 as string) ?? "Cabinet partagé à Morges";
  const body = (cabinet.body as string) ?? "Je reçois mes patients au sein d'un cabinet partagé situé au cœur de Morges, dans un environnement calme et professionnel, idéal pour la rééducation vestibulaire.\n\nLe cabinet est équipé du matériel nécessaire pour réaliser les évaluations vestibulaires et les exercices de rééducation dans les meilleures conditions.\n\nFacilement accessible en transports publics et en voiture, le cabinet dispose de places de parking à proximité.";
  const linkTitle = (cabinet.linkTitle as string) ?? "Lien vers le site du cabinet";
  const linkUrl = (cabinet.linkUrl as string) ?? "";

  const bodyParagraphs = body.split("\n\n").filter(Boolean);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Accueil
          </a>{" "}
          / <span>Cabinet</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
          {h1}
        </h1>

        <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
          {bodyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8 rounded-lg border bg-muted/30 p-6">
          <h2 className="font-heading text-lg font-semibold">
            {linkTitle}
          </h2>
          {linkUrl ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-primary hover:underline"
            >
              {linkUrl}
            </a>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Le lien vers le site du cabinet partagé sera ajouté prochainement.
            </p>
          )}
        </div>

        <div className="mt-8 flex items-start gap-3 text-muted-foreground">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Adresse</p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              {address.replace(/\n/g, ", ")}
            </a>
          </div>
        </div>

        <a href={phoneTel} className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          <Phone className="mr-2 h-5 w-5" />
          Prendre rendez-vous
        </a>
      </div>
    </section>
  );
}
