import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Phone, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, SITE_URL } from "@/lib/utils";
import {
  getSiteSettings,
  getPublishedServices,
  getGlobalFaqs,
  getGlobalTestimonials,
  getPublishedBlogPosts,
  getPageContent,
} from "@/db/queries";
import { ProcessTimeline } from "@/components/public/process-timeline";
import { ConditionCard } from "@/components/public/condition-card";
import { FAQAccordion } from "@/components/public/faq-accordion";
import { ContactForm } from "@/components/public/contact-form";

const TestimonialCarousel = dynamic(() =>
  import("@/components/public/testimonial-carousel").then(
    (mod) => mod.TestimonialCarousel
  )
);

export const revalidate = 60;

function LocalBusinessJsonLd(props: {
  phone: string;
  email: string;
  googleReviewCount: number | null;
  googleAverageRating: string | null;
  testimonials: Array<{ rating: number | null }>;
}) {
  const ratingsOnly = props.testimonials
    .map((t) => t.rating)
    .filter((r): r is number => r !== null && r > 0);

  const reviewCount = props.googleReviewCount ?? ratingsOnly.length;
  const avgRating = props.googleAverageRating
    ? parseFloat(props.googleAverageRating)
    : ratingsOnly.length > 0
      ? ratingsOnly.reduce((a, b) => a + b, 0) / ratingsOnly.length
      : 0;

  const aggregateRating =
    reviewCount >= 2 && avgRating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            reviewCount,
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
    url: SITE_URL,
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
  const [settings, services, faqs, testimonials, blogPosts, content] =
    await Promise.all([
      getSiteSettings(),
      getPublishedServices(),
      getGlobalFaqs(),
      getGlobalTestimonials(),
      getPublishedBlogPosts(),
      getPageContent("/"),
    ]);

  const phone = settings?.phone ?? "+41 77 274 71 44";
  const email = settings?.email ?? "info@physio-vertige.ch";
  const phoneTel = `tel:${phone.replace(/\s/g, "")}`;
  const latestPosts = blogPosts.slice(0, 3);
  const googleBusinessUrl =
    settings?.googleBusinessUrl ??
    "https://www.google.com/maps/place/Physio-vertige+Arnaud+Canadas/data=!4m2!3m1!1s0x0:0x4760ff2303cc9752";

  // Read editorial content from DB with fallbacks
  const c = (type: string, field: string, fallback: string) => {
    const section = content?.get(type);
    return (section?.[field] as string) ?? fallback;
  };

  const heroContent = content?.get("hero") ?? {};
  const conditionsContent = content?.get("conditions_grid") ?? {};
  const anatomyContent = content?.get("anatomy") ?? {};
  const processContent = content?.get("process_timeline") ?? {};
  const testimonialsContent = content?.get("testimonials") ?? {};
  const miniBioContent = content?.get("mini_bio") ?? {};
  const blogTeaserContent = content?.get("blog_teaser") ?? {};
  const faqContent = content?.get("faq") ?? {};
  const finalCtaContent = content?.get("cta_fullwidth") ?? {};

  // Images: read from section content first, fall back to site_settings
  const heroImageUrl = (heroContent.image_url as string) || settings?.homeHeroImageUrl;
  const heroImageAlt =
    (heroContent.image_alt as string) || (settings?.homeHeroImageAlt ??
    "Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges");
  const anatomyDiagramUrl = (anatomyContent.image_url as string) || settings?.homeAnatomyDiagramUrl;
  const anatomyDiagramAlt =
    (anatomyContent.image_alt as string) || (settings?.homeAnatomyDiagramAlt ??
    "Labyrinthe membraneux — schéma anatomique du système vestibulaire (vestibule en orange, cochlée en vert)");
  const anatomyCaption =
    (anatomyContent.caption as string) || (settings?.homeAnatomyCaption ??
    "Labyrinthe membraneux — vestibulaire (orange) et cochléaire (vert)");

  const processSteps = (processContent.steps as Array<{ title: string; description: string }>) ?? [
    { title: "Évaluation", description: "Bilan complet : tests oculomoteurs, manœuvres positionnelles, analyse de l'équilibre et de la marche." },
    { title: "Diagnostic", description: "Identification précise du type de vertige et de son origine pour un traitement ciblé." },
    { title: "Traitement", description: "Manœuvres de repositionnement, rééducation vestibulaire, exercices d'habituation personnalisés." },
    { title: "Suivi", description: "Programme d'exercices à domicile et séances de contrôle pour une guérison durable." },
  ];

  const anatomyBodyParagraphs = ((anatomyContent.body as string) ?? "").split("\n\n").filter(Boolean);

  return (
    <>
      <LocalBusinessJsonLd
        phone={phone}
        email={email}
        googleReviewCount={settings?.googleReviewCount ?? null}
        googleAverageRating={settings?.googleAverageRating ?? null}
        testimonials={testimonials}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-background py-20 md:py-32">
        {heroImageUrl && (
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src={heroImageUrl}
              alt=""
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover opacity-[0.12]"
            />
          </div>
        )}
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-heading text-4xl font-bold leading-[1.15] text-foreground sm:text-5xl lg:text-6xl">
              {(heroContent.h1 as string) ?? "Retrouvez votre équilibre."}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl whitespace-pre-line">
              {(heroContent.subhead as string) ?? "Physiothérapie vestibulaire spécialisée à Morges.\nArnaud Canadas vous accompagne pour traiter vos vertiges avec une approche experte et rassurante."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
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
        </div>
      </section>

      {/* Condition quiz grid */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              {(conditionsContent.eyebrow as string) ?? "Diagnostic"}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              {(conditionsContent.h2 as string) ?? "Quel type de vertige avez-vous ?"}
            </h2>
            <p className="mt-4 text-muted-foreground">
              {(conditionsContent.body as string) ?? "Chaque vertige a une cause spécifique et un traitement adapté. Identifiez votre situation et découvrez comment je peux vous aider."}
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
                  {(anatomyContent.eyebrow as string) ?? "Comprendre"}
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                  {(anatomyContent.h2 as string) ?? "L'oreille interne, votre centre de l'équilibre"}
                </h2>
                {anatomyBodyParagraphs.map((p, i) => (
                  <p key={i} className={`${i === 0 ? "mt-6" : "mt-4"} leading-relaxed text-muted-foreground`}>
                    {p}
                  </p>
                ))}
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
                  alt={anatomyDiagramAlt}
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
              {(processContent.eyebrow as string) ?? "Prise en charge"}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              {(processContent.h2 as string) ?? "Comment se déroule votre traitement ?"}
            </h2>
          </div>
          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      {/* About mini-block */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-10 lg:flex-row">
            {((miniBioContent.image_url as string) || settings?.aboutImageUrl) ? (
              <div className="h-48 w-48 shrink-0 overflow-hidden rounded-full shadow-lg">
                <Image
                  src={(miniBioContent.image_url as string) || settings?.aboutImageUrl || ""}
                  alt={(miniBioContent.image_alt as string) || (settings?.aboutImageAlt ?? "Arnaud Canadas, physiothérapeute vestibulaire spécialisé à Morges")}
                  width={384}
                  height={384}
                  sizes="192px"
                  className="h-full w-full object-cover object-[center_20%]"
                />
              </div>
            ) : (
              <div className="h-48 w-48 shrink-0 rounded-full bg-teal-100" />
            )}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {(miniBioContent.eyebrow as string) ?? "Votre thérapeute"}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold">
                {(miniBioContent.h2 as string) ?? "Arnaud Canadas"}
              </h2>
              {(miniBioContent.body as string) && (
                <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                  {miniBioContent.body as string}
                </p>
              )}
              {((miniBioContent.qualifications as string[]) ?? []).length > 0 && (
                <>
                  <h3 className="mt-6 font-heading text-lg font-semibold">Qualifications</h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {(miniBioContent.qualifications as string[]).map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </>
              )}
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

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-sand-50 py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {(testimonialsContent.eyebrow as string) ?? "Témoignages"}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                {(testimonialsContent.h2 as string) ?? "Ce que disent nos patients"}
              </h2>
            </div>
            <TestimonialCarousel
              testimonials={testimonials}
              googleBusinessUrl={googleBusinessUrl}
            />
          </div>
        </section>
      )}

      {/* Blog teaser */}
      {latestPosts.length > 0 && (
        <section className="bg-sand-50 py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {(blogTeaserContent.eyebrow as string) ?? "Blog"}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                {(blogTeaserContent.h2 as string) ?? "Comprendre les vertiges"}
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
                {(faqContent.eyebrow as string) ?? "FAQ"}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                {(faqContent.h2 as string) ?? "Questions fréquentes"}
              </h2>
            </div>
            <div className="mt-10">
              <FAQAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* Final CTA with embedded contact form */}
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              {(finalCtaContent.title as string) ?? "Prendre rendez-vous"}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
              {(finalCtaContent.description as string) ?? "N'hésitez pas à me contacter pour toute question ou pour fixer un rendez-vous."}
            </p>
          </div>
          <div className="mt-8 [&_label]:text-primary-foreground [&_input]:border-primary-foreground/30 [&_input]:bg-primary-foreground/10 [&_input]:text-primary-foreground [&_input]:placeholder-primary-foreground/50 [&_textarea]:border-primary-foreground/30 [&_textarea]:bg-primary-foreground/10 [&_textarea]:text-primary-foreground [&_textarea]:placeholder-primary-foreground/50 [&_a]:text-primary-foreground/80 [&_a:hover]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70 [&_.text-destructive]:text-red-300">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
