interface Step {
  title: string;
  description: string;
}

const defaultSteps: Step[] = [
  {
    title: "Évaluation",
    description:
      "Bilan complet : tests oculomoteurs, manœuvres positionnelles, analyse de l'équilibre et de la marche.",
  },
  {
    title: "Diagnostic",
    description:
      "Identification précise du type de vertige et de son origine pour un traitement ciblé.",
  },
  {
    title: "Traitement",
    description:
      "Manœuvres de repositionnement, rééducation vestibulaire, exercices d'habituation personnalisés.",
  },
  {
    title: "Suivi",
    description:
      "Programme d'exercices à domicile et séances de contrôle pour une guérison durable.",
  },
];

export function ProcessTimeline({ steps = defaultSteps }: { steps?: Step[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <div key={i} className="relative">
          {i < steps.length - 1 && (
            <div className="absolute left-5 top-12 hidden h-px w-[calc(100%-2.5rem)] bg-border lg:block" />
          )}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {i + 1}
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
