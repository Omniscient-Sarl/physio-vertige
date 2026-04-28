import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  description?: string;
  variant?: "inline" | "fullwidth";
};

export function CTABlock({
  title = "Vous reconnaissez ces symptômes ?",
  description = "Prenez rendez-vous avec Arnaud Canadas pour un bilan vestibulaire complet.",
  variant = "inline",
}: Props) {
  if (variant === "fullwidth") {
    return (
      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-bold sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            {description}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="tel:+41772747144"
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "text-primary"
              )}
            >
              <Phone className="mr-2 h-5 w-5" />
              Prendre rendez-vous
            </a>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({
                  size: "lg",
                  variant: "outline",
                }),
                "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              Formulaire de contact
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="my-10 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
      <h3 className="font-heading text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href="tel:+41772747144"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Phone className="mr-2 h-4 w-4" />
          Prendre rendez-vous
        </a>
        <Link
          href="/contact"
          className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
        >
          Formulaire de contact
        </Link>
      </div>
    </div>
  );
}
