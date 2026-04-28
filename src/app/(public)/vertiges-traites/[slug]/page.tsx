import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const servicesData: Record<
  string,
  { title: string; metaDescription: string; content: string[] }
> = {
  vppb: {
    title: "VPPB — Vertige Positionnel Paroxystique Bénin",
    metaDescription:
      "Traitement du VPPB à Morges. Manœuvres de repositionnement des cristaux de l'oreille interne par Arnaud Canadas, physiothérapeute vestibulaire.",
    content: [
      "Le Vertige Positionnel Paroxystique Bénin (VPPB) est la cause la plus fréquente de vertiges d'origine vestibulaire. Il est provoqué par le déplacement de petits cristaux de carbonate de calcium (otolithes) dans les canaux semi-circulaires de l'oreille interne.",
      "Les symptômes typiques incluent de brefs épisodes de vertiges rotatoires intenses déclenchés par les changements de position de la tête : se retourner dans le lit, regarder vers le haut, ou se pencher en avant.",
      "Le traitement repose sur des manœuvres de repositionnement spécifiques (manœuvre d'Epley, manœuvre de Sémont) qui permettent de remettre les cristaux en place. Ces manœuvres sont très efficaces, avec un taux de succès supérieur à 90% en 1 à 3 séances.",
      "Après le traitement, des exercices d'habituation peuvent être prescrits pour consolider les résultats et prévenir les récidives.",
    ],
  },
  "deficit-vestibulaire": {
    title: "Déficit vestibulaire périphérique",
    metaDescription:
      "Rééducation du déficit vestibulaire à Morges. Traitement spécialisé de la névrite vestibulaire et des troubles de l'équilibre.",
    content: [
      "Le déficit vestibulaire périphérique résulte d'une perte de fonction d'un ou des deux vestibules (organes de l'équilibre situés dans l'oreille interne). La cause la plus fréquente est la névrite vestibulaire, une inflammation d'origine virale du nerf vestibulaire.",
      "Les patients présentent typiquement un grand vertige rotatoire aigu accompagné de nausées, vomissements et d'une instabilité importante. La phase aiguë dure généralement quelques jours, suivie d'une récupération progressive.",
      "La rééducation vestibulaire joue un rôle essentiel dans la récupération. Elle vise à stimuler la compensation centrale : le cerveau apprend à s'adapter à la perte vestibulaire en utilisant davantage les informations visuelles et proprioceptives.",
      "Le programme de rééducation comprend des exercices de stabilisation du regard, d'équilibre statique et dynamique, ainsi que des exercices de marche adaptés progressivement.",
    ],
  },
  "maladie-de-meniere": {
    title: "Maladie de Ménière",
    metaDescription:
      "Accompagnement de la maladie de Ménière à Morges. Rééducation vestibulaire pour gérer les crises de vertiges et l'instabilité.",
    content: [
      "La maladie de Ménière est une affection chronique de l'oreille interne caractérisée par des crises récurrentes de vertiges rotatoires, une perte auditive fluctuante, des acouphènes et une sensation de plénitude auriculaire.",
      "Elle est liée à une augmentation de la pression du liquide endolymphatique dans l'oreille interne (hydrops endolymphatique). Les crises peuvent durer de 20 minutes à plusieurs heures.",
      "Bien que la physiothérapie vestibulaire ne traite pas la cause de la maladie, elle joue un rôle important dans la gestion de l'instabilité entre les crises et dans la rééducation après une perte vestibulaire progressive.",
      "L'accompagnement comprend des exercices d'équilibre, des stratégies de gestion des symptômes et une éducation thérapeutique pour aider le patient à mieux vivre avec la maladie.",
    ],
  },
  presbyvestibulie: {
    title: "Presbyvestibulie",
    metaDescription:
      "Traitement de la presbyvestibulie à Morges. Rééducation de l'équilibre pour prévenir les chutes chez les seniors.",
    content: [
      "La presbyvestibulie désigne le déclin progressif de la fonction vestibulaire lié au vieillissement. Comme la presbyacousie pour l'audition, elle touche progressivement les structures de l'oreille interne responsables de l'équilibre.",
      "Les symptômes se manifestent par une instabilité progressive à la marche, des difficultés d'équilibre dans l'obscurité ou sur des surfaces irrégulières, et un risque accru de chutes.",
      "La rééducation vestibulaire est particulièrement efficace pour cette population. Elle permet de stimuler les mécanismes de compensation et d'améliorer l'utilisation des informations visuelles et proprioceptives pour maintenir l'équilibre.",
      "Le programme inclut des exercices de renforcement, d'équilibre et de marche adaptés aux capacités de chaque patient, avec une progression graduelle pour garantir la sécurité.",
    ],
  },
  pppd: {
    title: "PPPD — Persistent Postural-Perceptual Dizziness",
    metaDescription:
      "Traitement du PPPD à Morges. Prise en charge des vertiges chroniques et de l'instabilité persistante.",
    content: [
      "Le PPPD (Persistent Postural-Perceptual Dizziness) est un trouble vestibulaire fonctionnel caractérisé par une sensation de vertige ou d'instabilité persistante pendant au moins 3 mois.",
      "Il se développe souvent après un épisode vestibulaire aigu (VPPB, névrite vestibulaire), un épisode de migraine vestibulaire, ou un événement stressant. Le système nerveux reste en état d'alerte, perpétuant les symptômes même après la résolution de la cause initiale.",
      "Les symptômes sont typiquement aggravés par la position debout, les mouvements de la tête, et les environnements visuellement complexes (supermarchés, écrans, foule).",
      "La rééducation vestibulaire est le traitement de première ligne. Elle repose sur une désensibilisation progressive aux mouvements et aux stimulations visuelles, combinée à des exercices d'équilibre et de marche.",
    ],
  },
  "causes-neurologiques": {
    title: "Causes neurologiques",
    metaDescription:
      "Vertiges d'origine neurologique à Morges. Évaluation et rééducation des vertiges liés à la sclérose en plaques, AVC, migraine vestibulaire.",
    content: [
      "Certains vertiges ont une origine centrale (cerveau et tronc cérébral) plutôt que périphérique (oreille interne). Il est essentiel de les identifier car leur prise en charge et leur pronostic diffèrent.",
      "Les causes neurologiques de vertiges incluent la migraine vestibulaire (la 2e cause la plus fréquente de vertiges récurrents), les accidents vasculaires cérébraux (AVC), la sclérose en plaques, et d'autres pathologies du système nerveux central.",
      "La rééducation vestibulaire peut être bénéfique dans certains cas, en complément du traitement médical. Elle vise à améliorer l'équilibre, la stabilité du regard et la confiance dans les déplacements.",
      "Une évaluation approfondie est indispensable pour orienter le patient vers la prise en charge la plus adaptée. En cas de suspicion de cause neurologique, une consultation médicale spécialisée est recommandée en priorité.",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) return {};
  return {
    title: service.title,
    description: service.metaDescription,
    alternates: {
      canonical: `https://physio-vertige.ch/vertiges-traites/${slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = servicesData[slug];
  if (!service) notFound();

  const medicalConditionSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalCondition",
    name: service.title,
    description: service.metaDescription,
    possibleTreatment: {
      "@type": "MedicalTherapy",
      name: "Rééducation vestibulaire",
      description:
        "Physiothérapie spécialisée pour le traitement des troubles vestibulaires.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">
              Accueil
            </a>{" "}
            /{" "}
            <a href="/vertiges-traites" className="hover:text-foreground">
              Vertiges traités
            </a>{" "}
            / <span>{service.title.split(" — ")[0]}</span>
          </nav>

          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            {service.title}
          </h1>

          <div className="mt-8 space-y-5 text-muted-foreground leading-relaxed">
            {service.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
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
