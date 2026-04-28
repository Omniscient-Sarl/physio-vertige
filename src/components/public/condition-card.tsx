import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  slug: string;
  title: string;
  shortDescription: string | null;
  heroHook?: string | null;
};

export function ConditionCard({ slug, title, shortDescription, heroHook }: Props) {
  return (
    <Link
      href={`/vertiges-traites/${slug}`}
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
    >
      <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {heroHook || shortDescription}
      </p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
        En savoir plus
        <ArrowRight className="ml-1 h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
