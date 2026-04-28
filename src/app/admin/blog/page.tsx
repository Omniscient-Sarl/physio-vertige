import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminBlogPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Blog</h1>
      <p className="mt-1 text-muted-foreground">
        Gérez les articles du blog.
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Connectez la base de données pour gérer les articles du blog.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
