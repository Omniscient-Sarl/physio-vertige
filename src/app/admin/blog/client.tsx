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
import { ImagePicker } from "@/components/admin/image-picker";
import { Plus, Pencil, Trash2, ExternalLink, X } from "lucide-react";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "@/app/admin/_actions/blog";

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  coverImageUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
  author: z.string().optional(),
  category: z.string().optional(),
  tagsStr: z.string().optional(),
  publishedAtStr: z.string().optional(),
});

type FaqItem = { question: string; answer: string };

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
  coverImageUrl: string | null;
  category: string | null;
  tags: unknown;
  faq: unknown;
  publishedAt: Date | null;
};

function FaqEditor({
  items,
  onChange,
}: {
  items: FaqItem[];
  onChange: (items: FaqItem[]) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>FAQ (questions / reponses)</Label>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Question {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
          <Input
            value={item.question}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = { ...updated[i], question: e.target.value };
              onChange(updated);
            }}
            placeholder="Question"
            className="text-sm"
          />
          <Textarea
            value={item.answer}
            onChange={(e) => {
              const updated = [...items];
              updated[i] = { ...updated[i], answer: e.target.value };
              onChange(updated);
            }}
            placeholder="Reponse"
            rows={2}
            className="text-sm"
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { question: "", answer: "" }])}
      >
        <Plus className="mr-1 h-3 w-3" />
        Ajouter une question
      </Button>
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const len = value.length;
  const color = len > max ? "text-destructive" : "text-muted-foreground";
  return (
    <span className={`text-xs ${color}`}>
      {len}/{max}
    </span>
  );
}

function PostForm({ post, onDone }: { post?: Post; onDone: () => void }) {
  const [pending, setPending] = useState(false);
  const tags = (post?.tags ?? []) as string[];
  const [faqItems, setFaqItems] = useState<FaqItem[]>(
    (post?.faq ?? []) as FaqItem[]
  );

  const { register, handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: post
      ? {
          slug: post.slug,
          title: post.title,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          coverImageUrl: post.coverImageUrl ?? "",
          status: post.status as "draft" | "published",
          author: post.author ?? "Arnaud Canadas",
          category: post.category ?? "",
          tagsStr: tags.join(", "),
          publishedAtStr: post.publishedAt
            ? new Date(post.publishedAt).toISOString().split("T")[0]
            : "",
        }
      : {
          status: "draft" as const,
          author: "Arnaud Canadas",
          publishedAtStr: new Date().toISOString().split("T")[0],
        },
  });

  const metaTitle = watch("metaTitle") ?? "";
  const metaDescription = watch("metaDescription") ?? "";
  const content = watch("content") ?? "";
  const coverImageUrl = watch("coverImageUrl") ?? "";

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  async function onSubmit(data: z.infer<typeof schema>) {
    setPending(true);
    const { tagsStr, publishedAtStr, ...rest } = data;
    const payload = {
      ...rest,
      tags: (tagsStr ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      faq: faqItems.filter((f) => f.question && f.answer),
      publishedAt: publishedAtStr ? new Date(publishedAtStr) : null,
    };
    const result = post
      ? await updateBlogPost(post.id, payload)
      : await createBlogPost(payload);
    if (result.success) {
      toast.success(post ? "Article mis a jour" : "Article cree");
      onDone();
    } else toast.error(result.error ?? "Erreur");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} className="mt-1" />
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
      </div>
      <div>
        <Label>Titre</Label>
        <Input {...register("title")} className="mt-1" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>Meta titre</Label>
          <CharCount value={metaTitle} max={60} />
        </div>
        <Input {...register("metaTitle")} className="mt-1" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>Meta description</Label>
          <CharCount value={metaDescription} max={155} />
        </div>
        <Textarea {...register("metaDescription")} className="mt-1" rows={2} />
      </div>
      <div>
        <Label>Extrait</Label>
        <Textarea {...register("excerpt")} className="mt-1" rows={2} />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label>Contenu (Markdown)</Label>
          <span className="text-xs text-muted-foreground">
            {wordCount} mots · ~{readingTime} min de lecture
          </span>
        </div>
        <Textarea
          {...register("content")}
          className="mt-1 font-mono text-sm"
          rows={16}
        />
      </div>
      <div>
        <Label>Image de couverture</Label>
        <ImagePicker
          value={coverImageUrl}
          onChange={(v) => setValue("coverImageUrl", v)}
          label="Couverture"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Categorie</Label>
          <Input
            {...register("category")}
            className="mt-1"
            placeholder="VPPB, Exercices, etc."
          />
        </div>
        <div>
          <Label>Tags (virgules)</Label>
          <Input {...register("tagsStr")} className="mt-1" />
        </div>
        <div>
          <Label>Date de publication</Label>
          <Input
            type="date"
            {...register("publishedAtStr")}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label>Auteur</Label>
        <Input {...register("author")} className="mt-1" />
      </div>

      {/* FAQ editor */}
      <div className="border-t pt-4">
        <FaqEditor items={faqItems} onChange={setFaqItems} />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : post ? "Mettre a jour" : "Creer"}
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
    toast.success("Article supprime");
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
            <h3 className="mb-4 font-heading font-semibold">
              Nouvel article
            </h3>
            <PostForm
              onDone={() => {
                setCreating(false);
                router.refresh();
              }}
            />
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
                  <Badge
                    variant={
                      post.status === "published" ? "default" : "secondary"
                    }
                  >
                    {post.status === "published" ? "Publie" : "Brouillon"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">/{post.slug}</p>
              </div>
              <div className="flex gap-2">
                {post.status === "published" && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEditingId(
                      editingId === post.id ? null : post.id
                    )
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
            {editingId === post.id && (
              <CardContent className="border-t p-6">
                <PostForm
                  post={post}
                  onDone={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                />
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
