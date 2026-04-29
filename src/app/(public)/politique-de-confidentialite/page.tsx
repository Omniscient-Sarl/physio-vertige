import type { Metadata } from "next";
import { getPageContent } from "@/db/queries";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site Physio-Vertige.",
  alternates: { canonical: "https://physio-vertige.ch/politique-de-confidentialite" },
  robots: { index: false },
};

const defaultBody = `## Collecte des données

Nous collectons les données personnelles que vous nous fournissez volontairement via le formulaire de contact\u00a0: nom, adresse email, numéro de téléphone (optionnel) et le contenu de votre message.

## Utilisation des données

Vos données sont utilisées exclusivement pour répondre à votre demande de contact et, le cas échéant, pour la prise de rendez-vous. Elles ne sont jamais vendues, partagées ou transmises à des tiers.

## Conservation des données

Les données collectées via le formulaire de contact sont conservées pour la durée nécessaire au traitement de votre demande, puis supprimées dans un délai raisonnable.

## Vos droits

Conformément à la Loi fédérale sur la protection des données (LPD) et au Règlement général sur la protection des données (RGPD), vous disposez d\u2019un droit d\u2019accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à info@physio-vertige.ch.

## Cookies

Ce site utilise des cookies techniques nécessaires à son bon fonctionnement. Aucun cookie de suivi ou publicitaire n\u2019est utilisé.

## Contact

Pour toute question relative à la protection de vos données\u00a0:
Arnaud Canadas \u2014 info@physio-vertige.ch`;

export default async function PolitiqueConfidentialitePage() {
  const content = await getPageContent("/politique-de-confidentialite");
  const section = content?.get("markdown_body") ?? {};
  const body = (section.body as string) ?? defaultBody;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Accueil</a> / <span>Politique de confidentialité</span>
        </nav>

        <h1 className="font-heading text-3xl font-bold">Politique de confidentialité</h1>

        <div className="mt-8">
          <MarkdownRenderer content={body} />
        </div>
      </div>
    </section>
  );
}
