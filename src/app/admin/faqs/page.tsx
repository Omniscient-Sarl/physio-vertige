import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFaqsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">FAQ</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les questions fréquentes.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connectez la base de données pour gérer les FAQ.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
