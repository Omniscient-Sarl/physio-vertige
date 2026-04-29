import { db } from "@/db/index";
import { pages } from "@/db/schema";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, ExternalLink } from "lucide-react";

export default async function AdminPagesPage() {
  const all = await db.select().from(pages);

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
        {all.map((page) => (
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
                <p className="text-sm text-muted-foreground">/{page.slug}</p>
                {page.metaTitle && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Meta: {page.metaTitle}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <a
                  href={`/${page.slug}`}
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
        ))}

        {all.length === 0 && (
          <p className="text-muted-foreground">Aucune page.</p>
        )}
      </div>
    </div>
  );
}
