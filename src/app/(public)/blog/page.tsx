import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedBlogPosts, getPageContent } from "@/db/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Articles sur les vertiges et l'équilibre",
  description:
    "Articles et conseils sur les vertiges, troubles de l'équilibre et la rééducation vestibulaire par Arnaud Canadas.",
  alternates: { canonical: "https://physio-vertige.ch/blog" },
};

function readingTime(content: string | null): string {
  if (!content) return "1 min";
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min de lecture`;
}

export default async function BlogPage() {
  const [posts, content] = await Promise.all([
    getPublishedBlogPosts(),
    getPageContent("/blog"),
  ]);
  const featured = posts[0];
  const rest = posts.slice(1);

  const hero = content?.get("blog_list_hero") ?? {};
  const eyebrow = (hero.eyebrow as string) ?? "Blog";
  const h1 = (hero.h1 as string) ?? "Comprendre les vertiges";
  const intro = (hero.intro as string) ?? "Articles, conseils et actualités sur les vertiges et la rééducation vestibulaire.";

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>{" "}
          / <span>Blog</span>
        </nav>

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
            {h1}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {intro}
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mt-12 block rounded-xl border border-border/60 bg-card p-8 transition-all hover:shadow-md sm:p-10"
          >
            {featured.category && (
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {featured.category}
              </span>
            )}
            <h2 className="mt-2 font-heading text-2xl font-bold group-hover:text-primary sm:text-3xl">
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p className="mt-3 max-w-2xl text-muted-foreground line-clamp-3">
                {featured.excerpt}
              </p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>{featured.author}</span>
              {featured.publishedAt && (
                <span>
                  {new Date(featured.publishedAt).toLocaleDateString("fr-CH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              <span>{readingTime(featured.content)}</span>
            </div>
          </Link>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
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
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {post.author}
                    {post.publishedAt &&
                      ` · ${new Date(post.publishedAt).toLocaleDateString(
                        "fr-CH",
                        { month: "short", day: "numeric" }
                      )}`}
                  </span>
                  <span>{readingTime(post.content)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="mt-12 text-center text-muted-foreground">
            Aucun article pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}
