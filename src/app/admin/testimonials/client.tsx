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
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/app/admin/_actions/testimonials";

const schema = z.object({
  authorName: z.string().min(1),
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  order: z.number().int(),
  published: z.boolean(),
});

type FormData = z.infer<typeof schema>;
type Testimonial = {
  id: number;
  authorName: string;
  content: string;
  rating: number | null;
  order: number;
  published: boolean;
};

function TestimonialForm({
  testimonial,
  onDone,
}: {
  testimonial?: Testimonial;
  onDone: () => void;
}) {
  const [pending, setPending] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: testimonial
      ? {
          authorName: testimonial.authorName,
          content: testimonial.content,
          rating: testimonial.rating ?? 5,
          order: testimonial.order,
          published: testimonial.published,
        }
      : { rating: 5, order: 0, published: true },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = testimonial
      ? await updateTestimonial(testimonial.id, data)
      : await createTestimonial(data);
    if (result.success) {
      toast.success(testimonial ? "Témoignage mis à jour" : "Témoignage créé");
      onDone();
    } else toast.error(result.error ?? "Erreur");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Nom</Label>
          <Input {...register("authorName")} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Note (1-5)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              {...register("rating", { valueAsNumber: true })}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Ordre</Label>
            <Input
              type="number"
              {...register("order", { valueAsNumber: true })}
              className="mt-1"
            />
          </div>
        </div>
      </div>
      <div>
        <Label>Contenu</Label>
        <Textarea {...register("content")} className="mt-1" rows={3} />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          {...register("published")}
          className="h-4 w-4"
        />
        <Label htmlFor="published">Publié</Label>
      </div>
      <Button type="submit" disabled={pending}>
        {pending
          ? "Enregistrement..."
          : testimonial
            ? "Mettre à jour"
            : "Créer"}
      </Button>
    </form>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </span>
  );
}

export function TestimonialsAdmin({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce témoignage ?")) return;
    await deleteTestimonial(id);
    toast.success("Témoignage supprimé");
    router.refresh();
  }

  return (
    <div>
      <Button onClick={() => setCreating(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" />
        Nouveau témoignage
      </Button>

      {creating && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 font-heading font-semibold">
              Nouveau témoignage
            </h3>
            <TestimonialForm
              onDone={() => {
                setCreating(false);
                router.refresh();
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{t.authorName}</p>
                  <Stars count={t.rating ?? 5} />
                  <span className="text-xs text-muted-foreground">
                    #{t.order} · {t.published ? "Publié" : "Brouillon"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {t.content}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEditingId(editingId === t.id ? null : t.id)
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(t.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
            {editingId === t.id && (
              <CardContent className="border-t p-6">
                <TestimonialForm
                  testimonial={t}
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
