"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type Page = {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string;
};

export function PagesAdmin({ pages }: { pages: Page[] }) {
  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Les pages sont rendues avec du contenu statique. Cette vue permet de consulter les métadonnées SEO.
      </p>
      <div className="space-y-4">
        {pages.map((page) => (
          <Card key={page.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{page.title}</p>
                <Badge
                  variant={
                    page.status === "published" ? "default" : "secondary"
                  }
                >
                  {page.status === "published" ? "Publié" : "Brouillon"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">/{page.slug}</p>
              {page.metaTitle && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Meta: {page.metaTitle}
                </p>
              )}
              {page.metaDescription && (
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {page.metaDescription}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
