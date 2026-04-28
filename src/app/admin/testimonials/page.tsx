import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminTestimonialsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Témoignages</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les témoignages des patients.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Liste des témoignages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connectez la base de données pour gérer les témoignages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
