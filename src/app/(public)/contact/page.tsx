import type { Metadata } from "next";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { ContactForm } from "@/components/public/contact-form";

export const metadata: Metadata = {
  title: "Contact — Prendre rendez-vous",
  description:
    "Contactez Arnaud Canadas, physiothérapeute vestibulaire à Morges. Prenez rendez-vous par téléphone ou via le formulaire de contact.",
  alternates: { canonical: "https://physio-vertige.ch/contact" },
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Accueil
          </a>{" "}
          / <span>Contact</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Contact
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
          Prendre rendez-vous
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          N&apos;hésitez pas à me contacter pour toute question ou pour fixer un
          rendez-vous. Je vous répondrai dans les meilleurs délais.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          <aside className="lg:col-span-2">
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Adresse</p>
                  <a
                    href="https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Rue de Couvaloup 16
                    <br />
                    1110 Morges
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <a
                    href="tel:+41772747144"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    +41 77 274 71 44
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a
                    href="mailto:info@physio-vertige.ch"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    info@physio-vertige.ch
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">Horaires</p>
                  <p className="text-sm text-muted-foreground">
                    Lundi - Vendredi : 08h00 - 19h00
                    <br />
                    Sur rendez-vous uniquement
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border">
              <iframe
                title="Cabinet Physio-Vertige Morges"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2751.5!2d6.498!3d46.511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRue+de+Couvaloup+16%2C+1110+Morges!5e0!3m2!1sfr!2sch!4v1"
                width="100%"
                height="250"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
