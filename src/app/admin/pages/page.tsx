import { db } from "@/db/index";
import { pages, pageSections } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, ExternalLink } from "lucide-react";

export default async function AdminPagesPage() {
  const all = await db.select().from(pages);

  // Get section counts per page
  const counts = await db
    .select({ pageId: pageSections.pageId, count: count() })
    .from(pageSections)
    .groupBy(pageSections.pageId);

  const countMap = new Map(counts.map((c) => [c.pageId, c.count]));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Pages</h1>
          <p className="mt-1 text-muted-foreground">
            Gerez les pages du site et leurs sections.
          </p>
        </div>
        <Link href="/admin/pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle page
          </Button>
        </Link>
      </div>

      <div className="mt-8 space-y-4">
        {all.map((page) => {
          const sectionCount = countMap.get(page.id) ?? 0;
          const publicUrl = page.slug === "/" || page.slug === "" ? "/" : `/${page.slug}`;

          return (
            <Card key={page.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{page.title}</p>
                    <Badge
                      variant={
                        page.status === "published" ? "default" : "secondary"
                      }
                    >
                      {page.status === "published" ? "Publie" : "Brouillon"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{publicUrl}</span>
                    <span>{sectionCount} section{sectionCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                  <Link href={`/admin/pages/${page.id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {all.length === 0 && (
          <p className="text-muted-foreground">Aucune page.</p>
        )}
      </div>
    </div>
  );
}
