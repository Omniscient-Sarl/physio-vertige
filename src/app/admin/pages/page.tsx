import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPagesPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Pages</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les pages du site et leurs sections.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Liste des pages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connectez la base de données pour gérer les pages. Les pages sont actuellement rendues avec du contenu statique.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
