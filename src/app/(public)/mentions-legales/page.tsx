import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site Physio-Vertige.",
  alternates: { canonical: "https://physio-vertige.ch/mentions-legales" },
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Accueil</a> / <span>Mentions légales</span>
        </nav>

        <h1 className="font-heading text-3xl font-bold">Mentions légales</h1>

        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Éditeur du site</h2>
            <p className="mt-2">
              Arnaud Canadas
              <br />
              Physiothérapeute vestibulaire
              <br />
              Rue de Couvaloup 16
              <br />
              1110 Morges, Suisse
              <br />
              Email : info@physio-vertige.ch
              <br />
              Téléphone : +41 77 274 71 44
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Hébergement</h2>
            <p className="mt-2">
              Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133,
              Walnut, CA 91789, États-Unis.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Propriété intellectuelle</h2>
            <p className="mt-2">
              L&apos;ensemble du contenu de ce site (textes, images, graphismes,
              logo, icônes) est la propriété exclusive d&apos;Arnaud Canadas, sauf
              mention contraire. Toute reproduction, distribution ou utilisation
              sans autorisation préalable est interdite.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Responsabilité</h2>
            <p className="mt-2">
              Les informations fournies sur ce site sont à titre informatif
              uniquement et ne constituent pas un avis médical. Consultez
              toujours un professionnel de santé qualifié pour tout problème
              médical.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
