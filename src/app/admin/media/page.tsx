import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMediaPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Médias</h1>
      <p className="mt-1 text-muted-foreground">
        Bibliothèque de médias et images uploadées.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Galerie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connectez la base de données pour gérer les médias.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
