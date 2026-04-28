import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPublishedServices, getServiceBySlug } from "@/db/queries";

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
    title: service.title,
    description: service.shortDescription ?? "",
    alternates: {
      canonical: `https://physio-vertige.ch/vertiges-traites/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const paragraphs = (service.longDescription ?? "")
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
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://physio-vertige.ch" },
      { "@type": "ListItem", position: 2, name: "Vertiges traités", item: "https://physio-vertige.ch/vertiges-traites" },
      { "@type": "ListItem", position: 3, name: service.title, item: `https://physio-vertige.ch/vertiges-traites/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalConditionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">Accueil</a>{" "}
            / <a href="/vertiges-traites" className="hover:text-foreground">Vertiges traités</a>{" "}
            / <span>{service.title.split(" — ")[0]}</span>
          </nav>

          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            {service.title}
          </h1>

          <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a href="tel:+41772747144" className={cn(buttonVariants({ size: "lg" }))}>
              <Phone className="mr-2 h-5 w-5" />
              Prendre rendez-vous
            </a>
            <Link href="/vertiges-traites" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tous les vertiges traités
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
