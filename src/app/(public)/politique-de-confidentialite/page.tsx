import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site Physio-Vertige.",
  alternates: { canonical: "https://physio-vertige.ch/politique-de-confidentialite" },
  robots: { index: false },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Accueil</a> / <span>Politique de confidentialité</span>
        </nav>

        <h1 className="font-heading text-3xl font-bold">Politique de confidentialité</h1>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Collecte des données</h2>
            <p className="mt-2">
              Nous collectons les données personnelles que vous nous fournissez
              volontairement via le formulaire de contact : nom, adresse email,
              numéro de téléphone (optionnel) et le contenu de votre message.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Utilisation des données</h2>
            <p className="mt-2">
              Vos données sont utilisées exclusivement pour répondre à votre
              demande de contact et, le cas échéant, pour la prise de
              rendez-vous. Elles ne sont jamais vendues, partagées ou
              transmises à des tiers.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Conservation des données</h2>
            <p className="mt-2">
              Les données collectées via le formulaire de contact sont conservées
              pour la durée nécessaire au traitement de votre demande, puis
              supprimées dans un délai raisonnable.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Vos droits</h2>
            <p className="mt-2">
              Conformément à la Loi fédérale sur la protection des données (LPD)
              et au Règlement général sur la protection des données (RGPD), vous
              disposez d&apos;un droit d&apos;accès, de rectification et de
              suppression de vos données personnelles. Pour exercer ces droits,
              contactez-nous à info@physio-vertige.ch.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Cookies</h2>
            <p className="mt-2">
              Ce site utilise des cookies techniques nécessaires à son bon
              fonctionnement. Aucun cookie de suivi ou publicitaire n&apos;est
              utilisé.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Contact</h2>
            <p className="mt-2">
              Pour toute question relative à la protection de vos données :<br />
              Arnaud Canadas — info@physio-vertige.ch
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
