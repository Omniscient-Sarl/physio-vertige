"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { createPage } from "@/app/admin/_actions/pages";

const schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  slug: z.string().min(1, "Le slug est requis"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

export default function NewPagePage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { status: "draft" as const },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setPending(true);
    const result = await createPage(data);
    if (result.success && result.id) {
      toast.success("Page creee");
      router.push(`/admin/pages/${result.id}`);
    } else {
      toast.error(result.error ?? "Erreur");
    }
    setPending(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="font-heading text-2xl font-bold">Nouvelle page</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Titre</Label>
                <Input {...register("title")} className="mt-1" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input {...register("slug")} className="mt-1" placeholder="ex: accueil" />
              </div>
            </div>
            <div>
              <Label>Meta titre</Label>
              <Input {...register("metaTitle")} className="mt-1" />
            </div>
            <div>
              <Label>Meta description</Label>
              <Textarea {...register("metaDescription")} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>Statut</Label>
              <select
                {...register("status")}
                className="mt-1 flex h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publie</option>
              </select>
            </div>
            <Button type="submit" disabled={pending}>
              {pending ? "Creation..." : "Creer la page"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
