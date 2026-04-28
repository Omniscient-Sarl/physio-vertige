import Image from "next/image";
import Link from "next/link";
import { Phone, MapPin, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getSiteSettings,
  getPublishedServices,
  getPublishedFaqs,
  getPublishedTestimonials,
} from "@/db/queries";

export const revalidate = 60;

function LocalBusinessJsonLd(props: {
  phone: string;
  email: string;
  address: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: "Physio-Vertige — Arnaud Canadas",
    description:
      "Physiothérapie vestibulaire spécialisée à Morges. Traitement des vertiges, troubles de l'équilibre, VPPB, maladie de Ménière.",
    url: "https://physio-vertige.ch",
    telephone: props.phone.replace(/\s/g, ""),
    email: props.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue de Couvaloup 16",
      addressLocality: "Morges",
      postalCode: "1110",
      addressCountry: "CH",
      addressRegion: "Vaud",
    },
    geo: { "@type": "GeoCoordinates", latitude: 46.5113, longitude: 6.4982 },
    areaServed: { "@type": "State", name: "Vaud" },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "19:00",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage() {
  const [settings, services, faqs, testimonials] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
    getPublishedFaqs(),
    getPublishedTestimonials(),
  ]);

  const phone = settings?.phone ?? "+41 77 274 71 44";
  const email = settings?.email ?? "info@physio-vertige.ch";
  const address = settings?.address ?? "Rue de Couvaloup 16, 1110 Morges";
  const phoneTel = `tel:${phone.replace(/\s/g, "")}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <LocalBusinessJsonLd phone={phone} email={email} address={address} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-background py-16 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 sm:px-6 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {settings?.tagline ?? "Physiothérapie vestibulaire · Morges"}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Arnaud Canadas — Physiothérapeute vestibulaire
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Vous ressentez des vertiges ou une instabilité ? Je vous
              accompagne avec une approche claire, rassurante et spécialisée.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a href={phoneTel} className={cn(buttonVariants({ size: "lg" }))}>
                <Phone className="mr-2 h-5 w-5" />
                Prendre rendez-vous
              </a>
              <Link
                href="/vertiges-traites"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                En savoir plus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-video w-full max-w-lg flex-shrink-0 overflow-hidden rounded-2xl lg:max-w-md">
            <Image
              src="/images/hero-vestibular-system.jpg"
              alt="Illustration du système vestibulaire de l'oreille interne"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 448px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section id="symptomes" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Symptômes
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold">
              Vertiges : causes et symptômes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Les vertiges provoquent des sensations de mouvement ou de rotation
              qui perturbent fortement l&apos;équilibre et la vie quotidienne.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Vertiges positionnels (VPPB)",
                description:
                  "Courts épisodes de vertiges causés par le déplacement de cristaux dans l'oreille interne.",
              },
              {
                title: "Troubles de l'équilibre",
                description:
                  "Difficultés à marcher ou rester stable, souvent liées à un déficit vestibulaire.",
              },
              {
                title: "Sensation de tête qui tourne",
                description:
                  "Vertiges persistants ou impression de rotation de l'environnement.",
              },
              {
                title: "Instabilité à la marche",
                description:
                  "Risque accru de chutes, particulièrement chez les personnes âgées.",
              },
            ].map((symptom) => (
              <Card key={symptom.title} className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold">
                    {symptom.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {symptom.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services from DB */}
      <section id="pathologies" className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Pathologies
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold">
              Causes fréquentes
            </h2>
            <p className="mt-4 text-muted-foreground">
              Prise en charge spécialisée des troubles vestibulaires les plus
              courants.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/vertiges-traites/${service.slug}`}
                className="group"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold group-hover:text-primary">
                      {service.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.shortDescription}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-lg rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="font-heading font-semibold text-destructive">
              Consultez en urgence si :
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Vertiges soudains ou très intenses
              </li>
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                Nausées, vomissements, fatigue intense ou troubles
                auditifs/visuels
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Rehabilitation steps */}
      <section id="reeducation" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Rééducation
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">
                La rééducation vestibulaire
              </h2>
              <p className="mt-4 text-muted-foreground">
                La physiothérapie vestibulaire traite la majorité des vertiges
                liés à l&apos;oreille interne, soulage les symptômes et restaure
                un équilibre durable.
              </p>
              <a
                href={phoneTel}
                className={cn(buttonVariants({ size: "lg" }), "mt-6")}
              >
                <Phone className="mr-2 h-5 w-5" />
                Prendre rendez-vous
              </a>
            </div>
            <div className="flex flex-col gap-6">
              {[
                {
                  step: "1",
                  title: "Évaluation personnalisée",
                  description:
                    "Analyse de l'équilibre, des mouvements oculaires et des symptômes.",
                },
                {
                  step: "2",
                  title: "Manœuvres pour VPPB",
                  description:
                    "Repositionnement des cristaux ou désensibilisation par mouvements répétés.",
                },
                {
                  step: "3",
                  title: "Exercices ciblés",
                  description:
                    "Adaptation du programme selon les progrès pour une rééducation efficace.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials from DB */}
      {testimonials.length > 0 && (
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Témoignages
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">
                Ce que disent nos patients
              </h2>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <Card key={t.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 text-primary">
                      {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground italic">
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <p className="mt-4 text-sm font-semibold">{t.authorName}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust signals */}
      <section className="border-y py-12">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-4 text-center sm:grid-cols-4 sm:px-6">
          {[
            { value: "10+", label: "Ans d'expérience" },
            { value: "1000+", label: "Patients traités" },
            { value: "95%", label: "Taux de satisfaction" },
            { value: "1-3", label: "Séances pour VPPB" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-heading text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ from DB */}
      {faqs.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                FAQ
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">
                Questions fréquentes
              </h2>
            </div>
            <Accordion className="mt-10">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                  <AccordionTrigger className="text-left font-heading font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section
        id="contact"
        className="bg-primary py-16 text-primary-foreground sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold">
              Prendre rendez-vous
            </h2>
            <p className="mt-3 text-primary-foreground/80">
              N&apos;hésitez pas à me contacter pour toute question ou pour
              fixer un rendez-vous.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
            <a
              href="https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-6 py-4 transition-colors hover:bg-primary-foreground/20"
            >
              <MapPin className="h-5 w-5" />
              <span>
                Rue de Couvaloup 16
                <br />
                1110 Morges
              </span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-6 py-4 transition-colors hover:bg-primary-foreground/20"
            >
              <Mail className="h-5 w-5" />
              {email}
            </a>
            <a
              href={phoneTel}
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-6 py-4 transition-colors hover:bg-primary-foreground/20"
            >
              <Phone className="h-5 w-5" />
              {phone}
            </a>
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "text-primary"
              )}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Formulaire de contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
