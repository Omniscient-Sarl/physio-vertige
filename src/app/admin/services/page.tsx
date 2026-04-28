import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminServicesPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Services</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les vertiges traités et les services proposés.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Liste des services</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connectez la base de données pour gérer les services.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
