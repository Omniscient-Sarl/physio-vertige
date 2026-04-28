"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createBlogPost, updateBlogPost, deleteBlogPost } from "@/app/admin/_actions/blog";

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  author: z.string().optional(),
  tagsStr: z.string().optional(),
});

type Post = {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string | null;
  content: string | null;
  status: string;
  author: string | null;
  tags: unknown;
  publishedAt: Date | null;
};

function PostForm({ post, onDone }: { post?: Post; onDone: () => void }) {
  const [pending, setPending] = useState(false);
  const tags = (post?.tags ?? []) as string[];
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: post
      ? {
          slug: post.slug,
          title: post.title,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          status: post.status as "draft" | "published",
          author: post.author ?? "Arnaud Canadas",
          tagsStr: tags.join(", "),
        }
      : { status: "draft" as const, author: "Arnaud Canadas" },
  });

  async function onSubmit(data: z.infer<typeof schema>) {
    setPending(true);
    const payload = {
      ...data,
      tags: (data.tagsStr ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    };
    const result = post
      ? await updateBlogPost(post.id, payload)
      : await createBlogPost(payload);
    if (result.success) {
      toast.success(post ? "Article mis à jour" : "Article créé");
      onDone();
    } else toast.error(result.error ?? "Erreur");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label>Slug</Label><Input {...register("slug")} className="mt-1" /></div>
        <div>
          <Label>Statut</Label>
          <select {...register("status")} className="mt-1 flex h-8 w-full rounded-lg border bg-background px-2.5 text-sm">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>
      </div>
      <div><Label>Titre</Label><Input {...register("title")} className="mt-1" /></div>
      <div><Label>Meta titre</Label><Input {...register("metaTitle")} className="mt-1" /></div>
      <div><Label>Meta description</Label><Input {...register("metaDescription")} className="mt-1" /></div>
      <div><Label>Extrait</Label><Textarea {...register("excerpt")} className="mt-1" rows={2} /></div>
      <div><Label>Contenu (Markdown)</Label><Textarea {...register("content")} className="mt-1 font-mono text-sm" rows={12} /></div>
      <div><Label>Tags (séparés par des virgules)</Label><Input {...register("tagsStr")} className="mt-1" /></div>
      <div><Label>Auteur</Label><Input {...register("author")} className="mt-1" /></div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : post ? "Mettre à jour" : "Créer"}
      </Button>
    </form>
  );
}

export function BlogAdmin({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet article ?")) return;
    await deleteBlogPost(id);
    toast.success("Article supprimé");
    router.refresh();
  }

  return (
    <div>
      <Button onClick={() => setCreating(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" />
        Nouvel article
      </Button>

      {creating && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 font-heading font-semibold">Nouvel article</h3>
            <PostForm onDone={() => { setCreating(false); router.refresh(); }} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{post.title}</p>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status === "published" ? "Publié" : "Brouillon"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">/{post.slug}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setEditingId(editingId === post.id ? null : post.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
            {editingId === post.id && (
              <CardContent className="border-t p-6">
                <PostForm post={post} onDone={() => { setEditingId(null); router.refresh(); }} />
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
