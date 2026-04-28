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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
};

function ServiceForm({
  service,
  onDone,
}: {
  service?: Service;
  onDone: () => void;
}) {
  const [pending, setPending] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({
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
        }
      : { order: 0, published: true },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = service
      ? await updateService(service.id, data)
      : await createService(data);
    if (result.success) {
      toast.success(service ? "Service mis à jour" : "Service créé");
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
        <Textarea {...register("longDescription")} className="mt-1" rows={6} />
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
        {pending ? "Enregistrement..." : service ? "Mettre à jour" : "Créer"}
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
    toast.success("Service supprimé");
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
            <h3 className="mb-4 font-heading font-semibold">Nouveau service</h3>
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
                  {service.published ? "Publié" : "Brouillon"}
                </p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={editingId === service.id}
                  onOpenChange={(open) =>
                    setEditingId(open ? service.id : null)
                  }
                >
                  <DialogTrigger
                    render={
                      <Button variant="ghost" size="icon" />
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogTitle className="font-heading text-lg font-semibold">
                      Modifier le service
                    </DialogTitle>
                    <div className="mt-4">
                      <ServiceForm
                        service={service}
                        onDone={() => {
                          setEditingId(null);
                          router.refresh();
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
