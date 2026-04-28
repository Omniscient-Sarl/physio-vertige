import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedBlogPosts } from "@/db/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Articles sur les vertiges et l'équilibre",
  description:
    "Articles et conseils sur les vertiges, troubles de l'équilibre et la rééducation vestibulaire par Arnaud Canadas.",
  alternates: { canonical: "https://physio-vertige.ch/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <a href="/" className="hover:text-foreground">Accueil</a> / <span>Blog</span>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Blog</p>
        <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">Articles & conseils</h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Informations, conseils et actualités sur les vertiges et la rééducation vestibulaire.
        </p>

        <div className="mt-12 space-y-6">
          {posts.map((post) => {
            const tags = (post.tags ?? []) as string[];
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <Card className="transition-shadow group-hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    <h2 className="mt-3 font-heading text-xl font-semibold group-hover:text-primary">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {post.author} ·{" "}
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("fr-CH", {
                              year: "numeric", month: "long", day: "numeric",
                            })
                          : ""}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-primary">
                        Lire
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground">Aucun article pour le moment.</p>
          )}
        </div>
      </div>
    </section>
  );
}
