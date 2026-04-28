import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getPublishedBlogPosts, getBlogPostBySlug } from "@/db/queries";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? "",
    alternates: { canonical: `https://physio-vertige.ch/blog/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const tags = (post.tags ?? []) as string[];
  const contentBlocks = (post.content ?? "").split("\n\n").filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt?.toISOString(),
    publisher: { "@type": "Organization", name: "Physio-Vertige", url: "https://physio-vertige.ch" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">Accueil</a>{" "}
            / <a href="/blog" className="hover:text-foreground">Blog</a>{" "}
            / <span className="truncate">{post.title.slice(0, 40)}...</span>
          </nav>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <h1 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Par {post.author} ·{" "}
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString("fr-CH", {
                  year: "numeric", month: "long", day: "numeric",
                })
              : ""}
          </p>

          <div className="mt-10 max-w-none">
            {contentBlocks.map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2 key={i} className="mt-8 mb-4 font-heading text-2xl font-bold">
                    {block.replace("## ", "")}
                  </h2>
                );
              }
              return (
                <p key={i} className="mb-4 leading-relaxed text-muted-foreground">{block}</p>
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
