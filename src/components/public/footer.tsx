import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const footerLinks = [
  { href: "/vertiges-traites", label: "Vertiges traités" },
  { href: "/le-physiotherapeute", label: "Le physiothérapeute" },
  { href: "/blog", label: "Blog" },
  { href: "/cabinet", label: "Cabinet" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-heading text-lg font-bold text-primary">
              Physio-Vertige
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Physiothérapie vestibulaire spécialisée à Morges, Canton de Vaud.
            </p>
          </div>

          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </p>
            <div className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground">
              <a
                href="https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 transition-colors hover:text-foreground"
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
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0" />
                info@physio-vertige.ch
              </a>
              <a
                href="tel:+41772747144"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +41 77 274 71 44
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Physio-Vertige — Arnaud Canadas. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
