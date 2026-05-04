import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, SITE_URL } from "@/lib/utils";
import Image from "next/image";
import {
  getPublishedBlogPosts,
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getSiteSettings,
  getPageContent,
} from "@/db/queries";
import { MarkdownRenderer } from "@/components/public/markdown-renderer";
import { extractHeadings } from "@/lib/markdown-utils";
import { TableOfContents } from "@/components/public/table-of-contents";
import { CTABlock } from "@/components/public/cta-block";

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
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author ? [post.author] : undefined,
    },
  };
}

function readingTime(content: string | null): string {
  if (!content) return "1 min";
  const words = content.split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, related, settings, blogContent] = await Promise.all([
    getBlogPostBySlug(slug),
    getRelatedBlogPosts(slug, 3),
    getSiteSettings(),
    getPageContent("/blog"),
  ]);
  if (!post) notFound();

  const phone = settings?.phone ?? "+41 77 274 71 44";
  const authorBio = blogContent?.get("author_bio") ?? {};
  const authorByline = (authorBio.byline as string) ?? "Physiothérapeute vestibulaire";
  const authorSubtitle = (authorBio.subtitle as string) ?? "Physiothérapeute spécialisé en rééducation vestibulaire";
  const authorBioBody = (authorBio.body as string) ?? "";
  const content = post.content ?? "";
  const headings = extractHeadings(content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt,
    image: post.coverImageUrl,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${SITE_URL}/le-physiotherapeute`,
    },
    datePublished: post.publishedAt?.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Physio-Vertige",
      url: SITE_URL,
    },
  };

  const faqItems = (post.faq ?? []) as Array<{ question: string; answer: string }>;
  const faqSchema = faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Header */}
          <div className="mx-auto max-w-3xl">
            <nav className="mb-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">
                Accueil
              </Link>{" "}
              /{" "}
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>{" "}
              / <span className="text-foreground">{post.title}</span>
            </nav>

            {post.category && (
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {post.category}
              </span>
            )}

            <h1 className="mt-2 font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                {settings?.aboutImageUrl ? (
                  <Image
                    src={settings.aboutImageUrl}
                    alt={settings.aboutImageAlt ?? "Arnaud Canadas"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover object-[center_20%]"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-teal-100" />
                )}
                <div>
                  <p className="font-medium text-foreground">{post.author}</p>
                  <p className="text-xs">{authorByline}</p>
                </div>
              </div>
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("fr-CH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              <span>{readingTime(content)} de lecture</span>
            </div>
          </div>

          {/* Content with ToC */}
          <div className="mt-12 flex gap-12">
            {/* Sticky ToC — desktop only */}
            <aside className="hidden w-56 shrink-0 lg:block">
              <TableOfContents headings={headings} />
            </aside>

            {/* Article body */}
            <div className="min-w-0 max-w-[680px] flex-1">
              <MarkdownRenderer content={content} />

              {/* Author bio */}
              <div className="mt-16 rounded-xl border border-border/60 bg-sand-50 p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  {settings?.aboutImageUrl ? (
                    <Image
                      src={settings.aboutImageUrl}
                      alt={settings.aboutImageAlt ?? "Arnaud Canadas"}
                      width={64}
                      height={64}
                      className="h-16 w-16 shrink-0 rounded-full object-cover object-[center_20%]"
                    />
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-full bg-teal-100" />
                  )}
                  <div>
                    <p className="font-heading text-lg font-semibold">
                      {post.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {authorSubtitle}
                    </p>
                  </div>
                </div>
                {authorBioBody && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {authorBioBody}
                  </p>
                )}
                <Link
                  href="/le-physiotherapeute"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-4"
                  )}
                >
                  Voir la bio complète
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="bg-sand-50 py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-8 text-center font-heading text-2xl font-bold">
              Articles liés
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-md"
                >
                  {r.category && (
                    <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                      {r.category}
                    </span>
                  )}
                  <h3 className="font-heading font-semibold group-hover:text-primary">
                    {r.title}
                  </h3>
                  {r.excerpt && (
                    <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2">
                      {r.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <CTABlock
        variant="fullwidth"
        title="Vous reconnaissez ces symptomes ?"
        description="Prenez rendez-vous avec Arnaud Canadas pour un bilan vestibulaire complet."
        phone={phone}
      />
    </>
  );
}
