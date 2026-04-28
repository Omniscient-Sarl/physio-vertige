import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const postsData: Record<
  string,
  {
    title: string;
    metaDescription: string;
    excerpt: string;
    date: string;
    author: string;
    tags: string[];
    content: string[];
  }
> = {
  "comprendre-le-vppb-vertiges-positionnels": {
    title: "Comprendre le VPPB : tout savoir sur les vertiges positionnels",
    metaDescription:
      "Découvrez le VPPB (Vertige Positionnel Paroxystique Bénin) : causes, symptômes et traitements. Guide complet par un physiothérapeute vestibulaire.",
    excerpt:
      "Le VPPB est la cause la plus fréquente de vertiges. Découvrez ses symptômes, ses causes et les traitements efficaces.",
    date: "2026-04-15",
    author: "Arnaud Canadas",
    tags: ["VPPB", "Vertiges", "Traitement"],
    content: [
      "Le Vertige Positionnel Paroxystique Bénin (VPPB) est le trouble vestibulaire le plus fréquent. Il représente environ 30% de tous les cas de vertiges vus en consultation. Malgré son nom rassurant (\"bénin\"), il peut être très invalidant pour les personnes qui en souffrent.",
      "## Qu'est-ce que le VPPB ?",
      "Le VPPB est causé par le déplacement de petits cristaux de carbonate de calcium, appelés otolithes ou otoconies, dans les canaux semi-circulaires de l'oreille interne. Ces cristaux, normalement fixés dans l'utricule, se détachent et migrent dans l'un des trois canaux semi-circulaires, perturbant la détection des mouvements de la tête.",
      "## Les symptômes caractéristiques",
      "Les symptômes du VPPB sont très reconnaissables : des épisodes brefs (généralement moins de 60 secondes) de vertiges rotatoires intenses, déclenchés par des changements de position de la tête. Les situations les plus courantes sont : se retourner dans le lit, regarder vers le haut (pour attraper un objet en hauteur), se pencher en avant, ou s'allonger rapidement.",
      "Les vertiges sont souvent accompagnés de nausées et parfois de vomissements. Entre les crises, le patient peut ressentir une sensation d'instabilité résiduelle.",
      "## Le diagnostic",
      "Le diagnostic du VPPB repose sur des tests positionnels spécifiques. Le test de Dix-Hallpike est le plus utilisé pour détecter un VPPB du canal postérieur (le plus fréquent). Le test de roulis (roll test) permet de diagnostiquer un VPPB du canal horizontal.",
      "Ces tests provoquent un nystagmus (mouvement involontaire des yeux) caractéristique qui permet d'identifier le canal atteint et le type de VPPB.",
      "## Le traitement",
      "Le traitement du VPPB repose sur des manœuvres de repositionnement qui visent à faire sortir les cristaux du canal semi-circulaire affecté. La manœuvre d'Epley est la plus connue et la plus efficace pour le VPPB du canal postérieur, avec un taux de succès supérieur à 90% en une à trois séances.",
      "D'autres manœuvres existent selon le canal atteint : la manœuvre de Sémont (canal postérieur), la manœuvre de Lempert ou BBQ (canal horizontal), entre autres.",
      "## Prévention des récidives",
      "Le VPPB a tendance à récidiver chez environ 30 à 50% des patients. Quelques conseils pour réduire le risque de récidive : maintenir un bon apport en vitamine D et calcium, éviter les positions prolongées tête en bas, et consulter rapidement en cas de réapparition des symptômes.",
      "Si vous souffrez de vertiges positionnels, n'hésitez pas à consulter un physiothérapeute vestibulaire. Le traitement est rapide, efficace et non invasif.",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(postsData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postsData[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.metaDescription,
    alternates: { canonical: `https://physio-vertige.ch/blog/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = postsData[slug];
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: { "@type": "Person", name: post.author },
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: "Physio-Vertige",
      url: "https://physio-vertige.ch",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://physio-vertige.ch" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://physio-vertige.ch/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://physio-vertige.ch/blog/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">Accueil</a>{" "}
            / <a href="/blog" className="hover:text-foreground">Blog</a>{" "}
            / <span className="truncate">{post.title.slice(0, 40)}...</span>
          </nav>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Par {post.author} ·{" "}
            {new Date(post.date).toLocaleDateString("fr-CH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="prose prose-slate mt-10 max-w-none">
            {post.content.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mt-8 mb-4 font-heading text-2xl font-bold"
                  >
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={i} className="mb-4 leading-relaxed text-muted-foreground">
                  {block}
                </p>
              );
            })}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t pt-8 sm:flex-row">
            <a href="tel:+41772747144" className={cn(buttonVariants({ size: "lg" }))}>
              <Phone className="mr-2 h-5 w-5" />
              Prendre rendez-vous
            </a>
            <Link href="/blog" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Tous les articles
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
