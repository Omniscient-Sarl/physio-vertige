import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const conditionLinks = [
  { href: "/vertiges-traites/vppb", label: "VPPB" },
  { href: "/vertiges-traites/nevrite-vestibulaire", label: "Névrite vestibulaire" },
  { href: "/vertiges-traites/maladie-de-meniere", label: "Maladie de Ménière" },
  { href: "/vertiges-traites/migraine-vestibulaire", label: "Migraine vestibulaire" },
  { href: "/vertiges-traites/vertige-cervicogenique", label: "Vertige cervicogénique" },
  { href: "/vertiges-traites/deficit-vestibulaire", label: "Déficit vestibulaire" },
  { href: "/vertiges-traites/mal-de-debarquement", label: "Mal de débarquement" },
  { href: "/vertiges-traites/vertige-post-commotion", label: "Vertige post-commotion" },
];

const siteLinks = [
  { href: "/le-physiotherapeute", label: "Le physiothérapeute" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
];

export function Footer() {
  return (
    <footer className="border-t bg-teal-900 text-teal-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-heading text-lg font-bold text-white">
              Physio-Vertige
            </p>
            <p className="mt-3 text-sm leading-relaxed text-teal-100/70">
              Physiothérapie vestibulaire spécialisée à Morges.
              Traitement des vertiges et troubles de l&apos;équilibre.
            </p>
            <p className="mt-4 text-xs text-teal-100/70">
              Zone de couverture : Morges, Lausanne, Nyon, Vevey, Canton de Vaud
            </p>
          </div>

          {/* Conditions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-100/70">
              Vertiges traités
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {conditionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-teal-100/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-100/70">
              Navigation
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {siteLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-teal-100/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-100/70">
              Contact
            </p>
            <div className="mt-3 flex flex-col gap-3 text-sm text-teal-100/70">
              <a
                href="https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Rue de Couvaloup 16
                  <br />
                  1110 Morges
                </span>
              </a>
              <a
                href="mailto:info@physio-vertige.ch"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                info@physio-vertige.ch
              </a>
              <a
                href="tel:+41772747144"
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +41 77 274 71 44
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-teal-800 pt-6 text-center text-xs text-teal-100/60">
          &copy; {new Date().getFullYear()} Physio-Vertige — Arnaud Canadas. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
