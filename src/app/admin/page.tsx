import Link from "next/link";
import {
  FileText,
  Stethoscope,
  BookOpen,
  MessageSquareQuote,
  HelpCircle,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db/index";
import {
  pages,
  services,
  blogPosts,
  testimonials,
  faqs,
  media,
} from "@/db/schema";
import { count, eq, avg } from "drizzle-orm";

async function getCounts() {
  const [
    [pageCount],
    [serviceCount],
    [blogPublished],
    [blogDraft],
    [testimonialCount],
    [testimonialAvg],
    [faqCount],
    [mediaCount],
  ] = await Promise.all([
    db.select({ value: count() }).from(pages),
    db.select({ value: count() }).from(services),
    db
      .select({ value: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published")),
    db
      .select({ value: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, "draft")),
    db.select({ value: count() }).from(testimonials),
    db.select({ value: avg(testimonials.rating) }).from(testimonials),
    db.select({ value: count() }).from(faqs),
    db.select({ value: count() }).from(media),
  ]);

  return {
    pages: pageCount.value,
    services: serviceCount.value,
    blogPublished: blogPublished.value,
    blogDraft: blogDraft.value,
    testimonials: testimonialCount.value,
    testimonialAvg: testimonialAvg.value
      ? parseFloat(testimonialAvg.value).toFixed(1)
      : null,
    faqs: faqCount.value,
    media: mediaCount.value,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    {
      href: "/admin/pages",
      label: "Pages",
      icon: FileText,
      stat: `${counts.pages} page${counts.pages !== 1 ? "s" : ""}`,
    },
    {
      href: "/admin/services",
      label: "Services",
      icon: Stethoscope,
      stat: `${counts.services} service${counts.services !== 1 ? "s" : ""}`,
    },
    {
      href: "/admin/blog",
      label: "Blog",
      icon: BookOpen,
      stat: `${counts.blogPublished} publie${counts.blogPublished !== 1 ? "s" : ""}, ${counts.blogDraft} brouillon${counts.blogDraft !== 1 ? "s" : ""}`,
    },
    {
      href: "/admin/testimonials",
      label: "Temoignages",
      icon: MessageSquareQuote,
      stat: `${counts.testimonials} temoignage${counts.testimonials !== 1 ? "s" : ""}${counts.testimonialAvg ? ` · ${counts.testimonialAvg}/5` : ""}`,
    },
    {
      href: "/admin/faqs",
      label: "FAQ",
      icon: HelpCircle,
      stat: `${counts.faqs} question${counts.faqs !== 1 ? "s" : ""}`,
    },
    {
      href: "/admin/media",
      label: "Medias",
      icon: ImageIcon,
      stat: `${counts.media} fichier${counts.media !== 1 ? "s" : ""}`,
    },
    {
      href: "/admin/site-settings",
      label: "Parametres",
      icon: Settings,
      stat: "Configuration du site",
    },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Tableau de bord</h1>
      <p className="mt-1 text-muted-foreground">
        Bienvenue dans l&apos;espace d&apos;administration de Physio-Vertige.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <CardContent className="flex items-start gap-4 p-6">
                <div className="rounded-lg bg-primary/10 p-3">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-heading font-semibold group-hover:text-primary">
                    {card.label}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.stat}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
