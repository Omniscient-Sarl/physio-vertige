import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog — Articles sur les vertiges et l'équilibre",
  description:
    "Articles et conseils sur les vertiges, troubles de l'équilibre et la rééducation vestibulaire par Arnaud Canadas.",
  alternates: { canonical: "https://physio-vertige.ch/blog" },
};

const posts = [
  {
    slug: "comprendre-le-vppb-vertiges-positionnels",
    title: "Comprendre le VPPB : tout savoir sur les vertiges positionnels",
    excerpt:
      "Le VPPB est la cause la plus fréquente de vertiges. Découvrez ses symptômes, ses causes et les traitements efficaces disponibles en physiothérapie vestibulaire.",
    date: "2026-04-15",
    tags: ["VPPB", "Vertiges", "Traitement"],
    author: "Arnaud Canadas",
  },
];

export default function BlogPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Accueil
          </a>{" "}
          / <span>Blog</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Blog
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
          Articles & conseils
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Informations, conseils et actualités sur les vertiges, les troubles de
          l&apos;équilibre et la rééducation vestibulaire.
        </p>

        <div className="mt-12 space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <Card className="transition-shadow group-hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="mt-3 font-heading text-xl font-semibold group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {post.author} ·{" "}
                      {new Date(post.date).toLocaleDateString("fr-CH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      Lire
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
