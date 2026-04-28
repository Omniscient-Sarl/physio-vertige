import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cabinet partagé — Morges",
  description:
    "Découvrez le cabinet de physiothérapie partagé situé au centre de Morges, Canton de Vaud.",
  alternates: { canonical: "https://physio-vertige.ch/cabinet" },
};

export default function CabinetPage() {
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
          Cabinet
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
          Cabinet partagé à Morges
        </h1>

        <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Je reçois mes patients au sein d&apos;un cabinet partagé situé au
            cœur de Morges, dans un environnement calme et professionnel, idéal
            pour la rééducation vestibulaire.
          </p>
          <p>
            Le cabinet est équipé du matériel nécessaire pour réaliser les
            évaluations vestibulaires et les exercices de rééducation dans les
            meilleures conditions.
          </p>
          <p>
            Facilement accessible en transports publics et en voiture, le
            cabinet dispose de places de parking à proximité.
          </p>
        </div>

        <div className="mt-8 rounded-lg border bg-muted/30 p-6">
          <h2 className="font-heading text-lg font-semibold">
            Lien vers le site du cabinet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {/* TODO: Arnaud will provide the colleague's website link */}
            Le lien vers le site du cabinet partagé sera ajouté prochainement.
          </p>
        </div>

        <div className="mt-8 flex items-start gap-3 text-muted-foreground">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Adresse</p>
            <a
              href="https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Rue de Couvaloup 16, 1110 Morges
            </a>
          </div>
        </div>

        <a href="tel:+41772747144" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          <Phone className="mr-2 h-5 w-5" />
          Prendre rendez-vous
        </a>
      </div>
    </section>
  );
}
