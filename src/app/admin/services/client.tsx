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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import {
  createService,
  updateService,
  deleteService,
} from "@/app/admin/_actions/services";

const schema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  iconName: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.number().int(),
  published: z.boolean(),
  // Condition page fields
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  heroHook: z.string().optional(),
  symptomsStr: z.string().optional(),
  causes: z.string().optional(),
  protocol: z.string().optional(),
  sessionDescription: z.string().optional(),
  sessionCount: z.string().optional(),
  relatedSlugsStr: z.string().optional(),
});

type FormData = z.infer<typeof schema>;
type Service = {
  id: number;
  slug: string;
  title: string;
  shortDescription: string | null;
  longDescription: string | null;
  iconName: string | null;
  imageUrl: string | null;
  order: number;
  published: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  heroHook: string | null;
  symptoms: unknown;
  causes: string | null;
  protocol: string | null;
  sessionDescription: string | null;
  sessionCount: string | null;
  relatedSlugs: unknown;
};

function ServiceForm({
  service,
  onDone,
}: {
  service?: Service;
  onDone: () => void;
}) {
  const [pending, setPending] = useState(false);
  const symptoms = (service?.symptoms ?? []) as string[];
  const relatedSlugs = (service?.relatedSlugs ?? []) as string[];

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: service
      ? {
          slug: service.slug,
          title: service.title,
          shortDescription: service.shortDescription ?? "",
          longDescription: service.longDescription ?? "",
          iconName: service.iconName ?? "",
          imageUrl: service.imageUrl ?? "",
          order: service.order,
          published: service.published,
          metaTitle: service.metaTitle ?? "",
          metaDescription: service.metaDescription ?? "",
          heroHook: service.heroHook ?? "",
          symptomsStr: symptoms.join("\n"),
          causes: service.causes ?? "",
          protocol: service.protocol ?? "",
          sessionDescription: service.sessionDescription ?? "",
          sessionCount: service.sessionCount ?? "",
          relatedSlugsStr: relatedSlugs.join(", "),
        }
      : { order: 0, published: true },
  });

  const imageUrl = watch("imageUrl");

  async function onSubmit(data: FormData) {
    setPending(true);
    const { symptomsStr, relatedSlugsStr, ...rest } = data;
    const payload = {
      ...rest,
      symptoms: (symptomsStr ?? "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      relatedSlugs: (relatedSlugsStr ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const result = service
      ? await updateService(service.id, payload)
      : await createService(payload);
    if (result.success) {
      toast.success(service ? "Service mis a jour" : "Service cree");
      onDone();
    } else toast.error(result.error ?? "Erreur");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Basic info */}
      <h4 className="font-heading text-sm font-semibold text-muted-foreground">
        Informations de base
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Slug</Label>
          <Input {...register("slug")} className="mt-1" />
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
      <div>
        <Label>Titre</Label>
        <Input {...register("title")} className="mt-1" />
      </div>
      <div>
        <Label>Description courte</Label>
        <Textarea {...register("shortDescription")} className="mt-1" rows={2} />
      </div>
      <div>
        <Label>Description longue</Label>
        <Textarea {...register("longDescription")} className="mt-1" rows={4} />
      </div>
      <div>
        <Label>Image hero</Label>
        <ImagePicker
          value={imageUrl ?? ""}
          onChange={(v) => setValue("imageUrl", v)}
          label="Image du service"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="svc-published"
          {...register("published")}
          className="h-4 w-4"
        />
        <Label htmlFor="svc-published">Publie</Label>
      </div>

      {/* SEO */}
      <h4 className="border-t pt-4 font-heading text-sm font-semibold text-muted-foreground">
        SEO — Page condition
      </h4>
      <div>
        <Label>Meta titre</Label>
        <Input {...register("metaTitle")} className="mt-1" />
      </div>
      <div>
        <Label>Meta description</Label>
        <Textarea {...register("metaDescription")} className="mt-1" rows={2} />
      </div>

      {/* Condition page content */}
      <h4 className="border-t pt-4 font-heading text-sm font-semibold text-muted-foreground">
        Contenu de la page condition
      </h4>
      <div>
        <Label>Accroche hero</Label>
        <Textarea
          {...register("heroHook")}
          className="mt-1"
          rows={2}
          placeholder="Phrase d'accroche sous le titre..."
        />
      </div>
      <div>
        <Label>Symptomes (un par ligne)</Label>
        <Textarea
          {...register("symptomsStr")}
          className="mt-1 font-mono text-sm"
          rows={5}
          placeholder={"Vertige rotatoire bref\nNausees\nInstabilite"}
        />
      </div>
      <div>
        <Label>Causes et declencheurs (Markdown)</Label>
        <Textarea
          {...register("causes")}
          className="mt-1 font-mono text-sm"
          rows={4}
        />
      </div>
      <div>
        <Label>Protocole de traitement (Markdown)</Label>
        <Textarea
          {...register("protocol")}
          className="mt-1 font-mono text-sm"
          rows={4}
        />
      </div>
      <div>
        <Label>Description d&apos;une seance</Label>
        <Textarea
          {...register("sessionDescription")}
          className="mt-1"
          rows={3}
        />
      </div>
      <div>
        <Label>Nombre de seances</Label>
        <Input
          {...register("sessionCount")}
          className="mt-1"
          placeholder="1 a 3 seances"
        />
      </div>
      <div>
        <Label>Slugs conditions liees (separes par des virgules)</Label>
        <Input
          {...register("relatedSlugsStr")}
          className="mt-1"
          placeholder="vppb, nevrite-vestibulaire"
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : service ? "Mettre a jour" : "Creer"}
      </Button>
    </form>
  );
}

export function ServicesAdmin({ services }: { services: Service[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer ce service ?")) return;
    await deleteService(id);
    toast.success("Service supprime");
    router.refresh();
  }

  return (
    <div>
      <Button onClick={() => setCreating(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" />
        Nouveau service
      </Button>

      {creating && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 font-heading font-semibold">
              Nouveau service
            </h3>
            <ServiceForm
              onDone={() => {
                setCreating(false);
                router.refresh();
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{service.title}</p>
                <p className="text-sm text-muted-foreground">
                  /{service.slug} · Ordre: {service.order} ·{" "}
                  {service.published ? "Publie" : "Brouillon"}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`/vertiges-traites/${service.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEditingId(
                      editingId === service.id ? null : service.id
                    )
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
            {editingId === service.id && (
              <CardContent className="border-t p-6">
                <ServiceForm
                  service={service}
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
