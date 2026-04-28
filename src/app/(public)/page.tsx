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

const symptoms = [
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
];

const conditions = [
  { title: "VPPB", description: "Cristaux déplacés dans l'oreille interne", slug: "vppb" },
  { title: "Déficit vestibulaire périphérique", description: "Infection ou problème circulatoire", slug: "deficit-vestibulaire" },
  { title: "Maladie de Ménière", description: "Vertiges associés à des troubles auditifs", slug: "maladie-de-meniere" },
  { title: "Presbyvestibulie", description: "Perte progressive liée à l'âge", slug: "presbyvestibulie" },
  { title: "PPPD", description: "Vertiges chroniques et instabilité persistante", slug: "pppd" },
  { title: "Causes neurologiques", description: "Sclérose en plaques, AVC, etc.", slug: "causes-neurologiques" },
];

const steps = [
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
      "Adaptation du programme selon les progrès pour une rééducation efficace et personnalisée.",
  },
];

const faqs = [
  {
    question: "Qu'est-ce que la physiothérapie vestibulaire ?",
    answer:
      "La physiothérapie vestibulaire est une spécialisation qui traite les troubles de l'équilibre et les vertiges liés au système vestibulaire (oreille interne). Elle utilise des techniques spécifiques comme les manœuvres de repositionnement et des exercices de rééducation.",
  },
  {
    question: "Combien de séances sont nécessaires ?",
    answer:
      "Le nombre de séances varie selon la pathologie. Pour un VPPB, 1 à 3 séances suffisent souvent. Pour un déficit vestibulaire, le traitement peut nécessiter 6 à 12 séances réparties sur plusieurs semaines.",
  },
  {
    question: "Faut-il une ordonnance médicale ?",
    answer:
      "En Suisse, une prescription médicale est nécessaire pour que les séances de physiothérapie soient remboursées par l'assurance maladie de base (LAMal). Vous pouvez consulter votre médecin ou ORL.",
  },
  {
    question: "Les séances sont-elles remboursées ?",
    answer:
      "Oui, avec une ordonnance médicale, les séances de physiothérapie vestibulaire sont prises en charge par l'assurance de base (LAMal), sous réserve de la franchise et de la quote-part.",
  },
];

function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: "Physio-Vertige — Arnaud Canadas",
    description:
      "Physiothérapie vestibulaire spécialisée à Morges. Traitement des vertiges, troubles de l'équilibre, VPPB, maladie de Ménière.",
    url: "https://physio-vertige.ch",
    telephone: "+41772747144",
    email: "info@physio-vertige.ch",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue de Couvaloup 16",
      addressLocality: "Morges",
      postalCode: "1110",
      addressCountry: "CH",
      addressRegion: "Vaud",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 46.5113,
      longitude: 6.4982,
    },
    areaServed: {
      "@type": "State",
      name: "Vaud",
    },
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

function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function HomePage() {
  return (
    <>
      <LocalBusinessJsonLd />
      <FaqJsonLd />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 to-background py-16 sm:py-24">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-4 sm:px-6 lg:flex-row">
          <div className="flex-1 text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Physiothérapie vestibulaire · Morges
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Arnaud Canadas — Physiothérapeute vestibulaire
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Vous ressentez des vertiges ou une instabilité ? Je vous
              accompagne avec une approche claire, rassurante et spécialisée.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a href="tel:+41772747144" className={cn(buttonVariants({ size: "lg" }))}>
                <Phone className="mr-2 h-5 w-5" />
                Prendre rendez-vous
              </a>
              <Link href="/vertiges-traites" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
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
              Les vertiges sont plus qu&apos;un simple désagrément. Ils
              provoquent des sensations de mouvement ou de rotation qui
              perturbent fortement l&apos;équilibre et la vie quotidienne.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {symptoms.map((symptom) => (
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
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground">
            Ils surviennent lorsque le cerveau reçoit des informations
            contradictoires provenant de l&apos;oreille interne, les yeux et les
            capteurs de position du corps.
          </p>
        </div>
      </section>

      {/* Conditions / Pathologies */}
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
            {conditions.map((condition) => (
              <Link
                key={condition.slug}
                href={`/vertiges-traites/${condition.slug}`}
                className="group"
              >
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold group-hover:text-primary">
                      {condition.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {condition.description}
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

      {/* How a session works - Timeline */}
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
              <p className="mt-3 text-muted-foreground">
                Si vos vertiges sont fréquents ou persistants, consultez un
                spécialiste pour un diagnostic précis et un plan de traitement
                adapté.
              </p>
              <a href="tel:+41772747144" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
                <Phone className="mr-2 h-5 w-5" />
                Prendre rendez-vous
              </a>
            </div>

            <div className="flex flex-col gap-6">
              {steps.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-y bg-muted/30 py-12">
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

      {/* FAQ */}
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
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
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

      {/* Contact CTA */}
      <section id="contact" className="bg-primary py-16 text-primary-foreground sm:py-24">
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
              href="mailto:info@physio-vertige.ch"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-6 py-4 transition-colors hover:bg-primary-foreground/20"
            >
              <Mail className="h-5 w-5" />
              info@physio-vertige.ch
            </a>
            <a
              href="tel:+41772747144"
              className="flex items-center gap-3 rounded-lg bg-primary-foreground/10 px-6 py-4 transition-colors hover:bg-primary-foreground/20"
            >
              <Phone className="h-5 w-5" />
              +41 77 274 71 44
            </a>
          </div>
          <div className="mt-8 text-center">
            <Link href="/contact" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "text-primary")}>
              <CheckCircle className="mr-2 h-5 w-5" />
              Formulaire de contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
