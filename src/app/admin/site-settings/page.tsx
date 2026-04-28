import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SiteSettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Paramètres du site</h1>
      <p className="mt-1 text-muted-foreground">
        Configurez les informations globales du site.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            La base de données n&apos;est pas encore connectée. Ajoutez la variable
            DATABASE_URL pour activer la gestion du contenu.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
