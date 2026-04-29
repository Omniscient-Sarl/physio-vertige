import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

type Service = { slug: string; title: string };

type Props = {
  phone: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  footerDescription: string;
  footerServiceArea: string;
  services: Service[];
};

const siteLinks = [
  { href: "/le-physiotherapeute", label: "Le physiotherapeute" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions legales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialite" },
];

export function Footer({
  phone,
  email,
  address,
  googleMapsUrl,
  footerDescription,
  footerServiceArea,
  services,
}: Props) {
  const addressLines = address.split("\n").filter(Boolean);
  const phoneTel = `tel:${phone.replace(/\s/g, "")}`;

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
              {footerDescription}
            </p>
            {footerServiceArea && (
              <p className="mt-4 text-xs text-teal-100/70">
                Zone de couverture : {footerServiceArea}
              </p>
            )}
          </div>

          {/* Conditions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-100/70">
              Vertiges traites
            </p>
            <nav className="mt-3 flex flex-col gap-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/vertiges-traites/${s.slug}`}
                  className="text-sm text-teal-100/70 transition-colors hover:text-white"
                >
                  {s.title}
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
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 transition-colors hover:text-white"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {addressLines.map((line, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {email}
              </a>
              <a
                href={phoneTel}
                className="flex items-center gap-2 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0" />
                {phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-teal-800 pt-6 text-center text-xs text-teal-100/60">
          &copy; {new Date().getFullYear()} Physio-Vertige — Arnaud Canadas. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
