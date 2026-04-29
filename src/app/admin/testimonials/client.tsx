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
import { ImagePicker } from "@/components/admin/image-picker";
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
  serviceId: z.number().int().nullable().optional(),
  authorAvatarUrl: z.string().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
  relativeTime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type ServiceOption = { id: number; title: string };
type Testimonial = {
  id: number;
  authorName: string;
  content: string;
  rating: number | null;
  order: number;
  published: boolean;
  serviceId: number | null;
  authorAvatarUrl: string | null;
  source: string | null;
  sourceUrl: string | null;
  relativeTime: string | null;
};

function TestimonialForm({
  testimonial,
  services,
  onDone,
}: {
  testimonial?: Testimonial;
  services: ServiceOption[];
  onDone: () => void;
}) {
  const [pending, setPending] = useState(false);
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: testimonial
      ? {
          authorName: testimonial.authorName,
          content: testimonial.content,
          rating: testimonial.rating ?? 5,
          order: testimonial.order,
          published: testimonial.published,
          serviceId: testimonial.serviceId ?? null,
          authorAvatarUrl: testimonial.authorAvatarUrl ?? "",
          source: testimonial.source ?? "",
          sourceUrl: testimonial.sourceUrl ?? "",
          relativeTime: testimonial.relativeTime ?? "",
        }
      : {
          rating: 5,
          order: 0,
          published: true,
          serviceId: null,
          authorAvatarUrl: "",
          source: "",
          sourceUrl: "",
          relativeTime: "",
        },
  });

  const authorAvatarUrl = watch("authorAvatarUrl") ?? "";

  async function onSubmit(data: FormData) {
    setPending(true);
    const payload = {
      ...data,
      serviceId: data.serviceId || null,
    };
    const result = testimonial
      ? await updateTestimonial(testimonial.id, payload)
      : await createTestimonial(payload);
    if (result.success) {
      toast.success(testimonial ? "Temoignage mis a jour" : "Temoignage cree");
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
      <div>
        <Label>Service associe</Label>
        <select
          {...register("serviceId", {
            setValueAs: (v) => (v === "" || v === "null" ? null : Number(v)),
          })}
          className="mt-1 flex h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
        >
          <option value="">Aucun (general)</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Avatar</Label>
        <ImagePicker
          value={authorAvatarUrl}
          onChange={(v) => setValue("authorAvatarUrl", v)}
          label="Avatar"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Source</Label>
          <Input
            {...register("source")}
            className="mt-1"
            placeholder="google / manual"
          />
        </div>
        <div>
          <Label>URL source</Label>
          <Input
            {...register("sourceUrl")}
            className="mt-1"
            placeholder="https://..."
          />
        </div>
        <div>
          <Label>Date relative</Label>
          <Input
            {...register("relativeTime")}
            className="mt-1"
            placeholder="il y a 2 semaines"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          {...register("published")}
          className="h-4 w-4"
        />
        <Label htmlFor="published">Publie</Label>
      </div>
      <Button type="submit" disabled={pending}>
        {pending
          ? "Enregistrement..."
          : testimonial
            ? "Mettre a jour"
            : "Creer"}
      </Button>
    </form>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
        />
      ))}
    </span>
  );
}

export function TestimonialsAdmin({
  testimonials,
  services,
}: {
  testimonials: Testimonial[];
  services: ServiceOption[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce temoignage ?")) return;
    await deleteTestimonial(id);
    toast.success("Temoignage supprime");
    router.refresh();
  }

  return (
    <div>
      <Button onClick={() => setCreating(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" />
        Nouveau temoignage
      </Button>

      {creating && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 font-heading font-semibold">
              Nouveau temoignage
            </h3>
            <TestimonialForm
              services={services}
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
                    #{t.order} · {t.published ? "Publie" : "Brouillon"}
                    {t.serviceId
                      ? ` · ${services.find((s) => s.id === t.serviceId)?.title ?? "Service #" + t.serviceId}`
                      : ""}
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
                  services={services}
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
