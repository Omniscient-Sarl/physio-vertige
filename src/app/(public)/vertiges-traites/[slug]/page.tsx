import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getPublishedServices,
  getServiceBySlug,
  getPublishedFaqs,
  getPublishedTestimonials,
} from "@/db/queries";
import { FAQAccordion } from "@/components/public/faq-accordion";
import { TestimonialCarousel } from "@/components/public/testimonial-carousel";
import { CTABlock } from "@/components/public/cta-block";
import { BookingStickyMobile } from "@/components/public/booking-sticky-mobile";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getPublishedServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.metaTitle ?? service.title,
    description:
      service.metaDescription ??
      service.shortDescription ??
      "",
    alternates: {
      canonical: `https://physio-vertige.ch/vertiges-traites/${slug}`,
    },
  };
}

export default async function ConditionPage({ params }: Props) {
  const { slug } = await params;
  const [service, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getPublishedServices(),
  ]);
  if (!service) notFound();

  const [conditionFaqs, conditionTestimonials] = await Promise.all([
    getPublishedFaqs(service.id),
    getPublishedTestimonials(service.id),
  ]);

  const relatedSlugs = (service.relatedSlugs ?? []) as string[];
  const relatedServices = allServices.filter(
    (s) => relatedSlugs.includes(s.slug) && s.slug !== slug
  );

  const symptoms = (service.symptoms ?? []) as string[];
  const longDescParagraphs = (service.longDescription ?? "")
    .split("\n\n")
    .filter(Boolean);

  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: service.title,
    description: service.shortDescription,
    possibleTreatment: {
      "@type": "MedicalTherapy",
      name: "Rééducation vestibulaire",
      performer: {
        "@type": "Physician",
        name: "Arnaud Canadas",
        url: "https://physio-vertige.ch/le-physiotherapeute",
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://physio-vertige.ch",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Vertiges traités",
        item: "https://physio-vertige.ch/vertiges-traites",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `https://physio-vertige.ch/vertiges-traites/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(medicalConditionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50 to-background py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Accueil
            </Link>{" "}
            /{" "}
            <Link href="/vertiges-traites" className="hover:text-foreground">
              Vertiges traités
            </Link>{" "}
            / <span className="text-foreground">{service.title}</span>
          </nav>

          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {service.title}
          </h1>

          {service.heroHook && (
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {service.heroHook}
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:+41772747144"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              <Phone className="mr-2 h-5 w-5" />
              Prendre rendez-vous
            </a>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" })
              )}
            >
              Formulaire de contact
            </Link>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <article className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {/* What is it */}
          {longDescParagraphs.length > 0 && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Qu&apos;est-ce que {service.title.toLowerCase().replace(/ — .*/, "")} ?
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {longDescParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}

          {/* Symptoms */}
          {symptoms.length > 0 && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Symptômes typiques
              </h2>
              <ul className="mt-6 space-y-3">
                {symptoms.map((symptom, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-muted-foreground"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Causes */}
          {service.causes && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Causes &amp; déclencheurs
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {service.causes.split("\n\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}

          {/* CTA mid-page */}
          <CTABlock />

          {/* Protocol */}
          {service.protocol && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Comment Arnaud Canadas vous aide
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {service.protocol.split("\n\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          )}

          {/* Session description */}
          {service.sessionDescription && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                À quoi ressemble une séance ?
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {service.sessionDescription
                  .split("\n\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            </section>
          )}

          {/* Session count */}
          {service.sessionCount && (
            <section className="mb-16">
              <h2 className="font-heading text-2xl font-bold sm:text-3xl">
                Combien de séances faut-il ?
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {service.sessionCount
                  .split("\n\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            </section>
          )}
        </div>
      </article>

      {/* Condition-specific FAQ */}
      {conditionFaqs.length > 0 && (
        <section className="bg-sand-50 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              Questions fréquentes
            </h2>
            <div className="mt-8">
              <FAQAccordion faqs={conditionFaqs} />
            </div>
          </div>
        </section>
      )}

      {/* Condition-specific testimonials */}
      {conditionTestimonials.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold sm:text-3xl">
              Témoignages de patients
            </h2>
            <TestimonialCarousel testimonials={conditionTestimonials} />
          </div>
        </section>
      )}

      {/* Related conditions */}
      {relatedServices.length > 0 && (
        <section className="bg-sand-50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold sm:text-3xl">
              Conditions associées
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/vertiges-traites/${s.slug}`}
                  className="group rounded-xl border border-border/60 bg-card p-5 transition-all hover:shadow-md"
                >
                  <h3 className="font-heading font-semibold group-hover:text-primary">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {s.shortDescription}
                  </p>
                  <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                    En savoir plus
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <CTABlock
        variant="fullwidth"
        title="Prendre rendez-vous"
        description="Commencez votre traitement dès aujourd'hui. Arnaud Canadas vous accueille à Morges."
      />

      <BookingStickyMobile />
    </>
  );
}
