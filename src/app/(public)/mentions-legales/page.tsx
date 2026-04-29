import type { Metadata } from "next";
import { getPageContent } from "@/db/queries";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Physio-Vertige.",
  alternates: { canonical: "https://physio-vertige.ch/mentions-legales" },
  robots: { index: false },
};

const defaultBody = `## Éditeur du site

Arnaud Canadas
Physiothérapeute vestibulaire
Rue de Couvaloup 16
1110 Morges, Suisse
Email\u00a0: info@physio-vertige.ch
Téléphone\u00a0: +41 77 274 71 44

## Hébergement

Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.

## Propriété intellectuelle

L\u2019ensemble du contenu de ce site (textes, images, graphismes, logo, icônes) est la propriété exclusive d\u2019Arnaud Canadas, sauf mention contraire. Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.

## Responsabilité

Les informations fournies sur ce site sont à titre informatif uniquement et ne constituent pas un avis médical. Consultez toujours un professionnel de santé qualifié pour tout problème médical.`;

export default async function MentionsLegalesPage() {
  const content = await getPageContent("/mentions-legales");
  const section = content?.get("markdown_body") ?? {};
  const body = (section.body as string) ?? defaultBody;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Accueil</a> / <span>Mentions légales</span>
        </nav>

        <h1 className="font-heading text-3xl font-bold">Mentions légales</h1>

        <div className="mt-8">
          <MarkdownRenderer content={body} />
        </div>
      </div>
    </section>
  );
}
