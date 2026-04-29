import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Phone, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSiteSettings,
  getPublishedServices,
  getGlobalFaqs,
  getGlobalTestimonials,
  getPublishedBlogPosts,
} from "@/db/queries";
import { ProcessTimeline } from "@/components/public/process-timeline";
import { ConditionCard } from "@/components/public/condition-card";
import { FAQAccordion } from "@/components/public/faq-accordion";
import { CTABlock } from "@/components/public/cta-block";

const TestimonialCarousel = dynamic(() =>
  import("@/components/public/testimonial-carousel").then(
    (mod) => mod.TestimonialCarousel
  )
);

export const revalidate = 60;

function LocalBusinessJsonLd(props: {
  phone: string;
  email: string;
  testimonials: Array<{ rating: number | null }>;
}) {
  const ratingsOnly = props.testimonials
    .map((t) => t.rating)
    .filter((r): r is number => r !== null && r > 0);

  const aggregateRating =
    ratingsOnly.length >= 3
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: (
              ratingsOnly.reduce((a, b) => a + b, 0) / ratingsOnly.length
            ).toFixed(1),
            reviewCount: ratingsOnly.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {};

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
    ...aggregateRating,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function HomePage() {
  const [settings, services, faqs, testimonials, blogPosts] =
    await Promise.all([
      getSiteSettings(),
      getPublishedServices(),
      getGlobalFaqs(),
      getGlobalTestimonials(),
      getPublishedBlogPosts(),
    ]);

  const phone = settings?.phone ?? "+41 77 274 71 44";
  const email = settings?.email ?? "info@physio-vertige.ch";
  const phoneTel = `tel:${phone.replace(/\s/g, "")}`;
  const latestPosts = blogPosts.slice(0, 3);
  const heroImageUrl = settings?.homeHeroImageUrl;
  const anatomyDiagramUrl = settings?.homeAnatomyDiagramUrl;
  const anatomyCaption =
    settings?.homeAnatomyCaption ??
    "Labyrinthe membraneux — vestibulaire (orange) et cochléaire (vert)";
  const googleBusinessUrl =
    settings?.googleBusinessUrl ??
    "https://www.google.com/maps/place/Physio-vertige+Arnaud+Canadas/data=!4m2!3m1!1s0x0:0x4760ff2303cc9752";

  return (
    <>
      <LocalBusinessJsonLd
        phone={phone}
        email={email}
        testimonials={testimonials}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-background py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="font-heading text-4xl font-bold leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
                Retrouvez votre équilibre.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                Physiothérapie vestibulaire spécialisée à Morges.
                <br className="hidden sm:block" />
                Arnaud Canadas vous accompagne pour traiter vos vertiges
                avec une approche experte et rassurante.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a
                  href={phoneTel}
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Prendre rendez-vous
                </a>
                <Link
                  href="/vertiges-traites"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" })
                  )}
                >
                  Comprendre mes vertiges
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Right: portrait */}
            {heroImageUrl && (
              <div className="relative w-72 shrink-0 sm:w-80 lg:w-96">
                <div className="aspect-[16/9] overflow-hidden rounded-2xl shadow-xl">
                  <Image
                    src={heroImageUrl}
                    alt="Illustration de l'oreille interne — système vestibulaire et cochléaire"
                    width={1280}
                    height={720}
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 768px) 80vw, 384px"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Condition quiz grid */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Diagnostic
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Quel type de vertige avez-vous ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Chaque vertige a une cause spécifique et un traitement adapté.
              Identifiez votre situation et découvrez comment je peux vous aider.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ConditionCard
                key={service.slug}
                slug={service.slug}
                title={service.title}
                shortDescription={service.shortDescription}
                heroHook={service.heroHook}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Anatomy section */}
      {anatomyDiagramUrl && (
        <section className="bg-sand-50 py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
              <div className="flex-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Comprendre
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                  L&apos;oreille interne, votre centre de l&apos;équilibre
                </h2>
                <p className="mt-6 leading-relaxed text-muted-foreground">
                  Au cœur de chaque oreille interne se trouvent deux
                  systèmes : la cochlée, qui traite les sons, et le système
                  vestibulaire, qui informe en permanence votre cerveau de la
                  position et des mouvements de votre tête. Lorsque ce dernier
                  dysfonctionne, vous ressentez des vertiges, des nausées ou une
                  instabilité.
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Comprendre quelle structure est en cause permet de cibler la
                  rééducation. Lors de la première consultation, Arnaud Canadas
                  réalise des tests positionnels précis pour identifier la zone
                  exacte responsable de vos symptômes — souvent en une seule
                  séance.
                </p>
                <Link
                  href="/vertiges-traites"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-6"
                  )}
                >
                  Comprendre vos vertiges
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </div>
              <figure className="w-full max-w-sm shrink-0 lg:w-96">
                <Image
                  src={anatomyDiagramUrl}
                  alt="Labyrinthe membraneux — schéma anatomique du système vestibulaire (vestibule en orange, cochlée en vert)"
                  width={800}
                  height={600}
                  sizes="(max-width: 768px) 90vw, 384px"
                  className="rounded-xl"
                />
                <figcaption className="mt-2 text-center text-xs text-muted-foreground">
                  {anatomyCaption}
                </figcaption>
              </figure>
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Prise en charge
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Comment se déroule votre traitement ?
            </h2>
          </div>
          <ProcessTimeline />
        </div>
      </section>

      {/* Inline CTA */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <CTABlock
            title="Prêt à retrouver votre équilibre ?"
            description="Un bilan vestibulaire permet d'identifier la cause de vos vertiges et de commencer le traitement adapté dès la première séance."
          />
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-sand-50 py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Témoignages
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                Ce que disent nos patients
              </h2>
            </div>
            <TestimonialCarousel
              testimonials={testimonials}
              googleBusinessUrl={googleBusinessUrl}
            />
          </div>
        </section>
      )}

      {/* About mini-block */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-10 lg:flex-row">
            <div className="h-48 w-48 shrink-0 rounded-full bg-teal-100" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Votre thérapeute
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">
                Arnaud Canadas
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                Physiothérapeute spécialisé en rééducation vestibulaire,
                Arnaud Canadas accompagne depuis plus de 10 ans les patients
                souffrant de vertiges et troubles de l&apos;équilibre.
                Formé aux dernières techniques de diagnostic et de traitement,
                il offre une prise en charge complète et personnalisée.
              </p>
              <Link
                href="/le-physiotherapeute"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "mt-6"
                )}
              >
                Lire ma bio complète
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Blog teaser */}
      {latestPosts.length > 0 && (
        <section className="bg-sand-50 py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Blog
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                Comprendre les vertiges
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-md"
                >
                  {post.category && (
                    <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      {post.category}
                    </span>
                  )}
                  <h3 className="font-heading text-lg font-semibold group-hover:text-primary">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="mt-4 text-xs text-muted-foreground">
                    {post.author}
                    {post.publishedAt &&
                      ` · ${new Date(post.publishedAt).toLocaleDateString(
                        "fr-CH",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}`}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className={cn(
                  buttonVariants({ variant: "outline" })
                )}
              >
                Tous les articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 md:py-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                FAQ
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                Questions fréquentes
              </h2>
            </div>
            <div className="mt-10">
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <CTABlock
        variant="fullwidth"
        title="Prendre rendez-vous"
        description="N'hésitez pas à me contacter pour toute question ou pour fixer un rendez-vous."
      />
    </>
  );
}
