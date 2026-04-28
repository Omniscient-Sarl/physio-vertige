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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { createFaq, updateFaq, deleteFaq } from "@/app/admin/_actions/faqs";

const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().optional(),
  order: z.number().int(),
  published: z.boolean(),
});

type FormData = z.infer<typeof schema>;
type Faq = {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  published: boolean;
};

function FaqForm({ faq, onDone }: { faq?: Faq; onDone: () => void }) {
  const [pending, setPending] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: faq
      ? {
          question: faq.question,
          answer: faq.answer,
          category: faq.category ?? "",
          order: faq.order,
          published: faq.published,
        }
      : { order: 0, published: true },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = faq
      ? await updateFaq(faq.id, data)
      : await createFaq(data);
    if (result.success) {
      toast.success(faq ? "FAQ mise à jour" : "FAQ créée");
      onDone();
    } else toast.error(result.error ?? "Erreur");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input {...register("question")} className="mt-1" />
      </div>
      <div>
        <Label>Réponse</Label>
        <Textarea {...register("answer")} className="mt-1" rows={4} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Catégorie</Label>
          <Input {...register("category")} className="mt-1" />
        </div>
        <div>
          <Label>Ordre</Label>
          <Input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="mt-1"
          />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <input
            type="checkbox"
            id="published"
            {...register("published")}
            className="h-4 w-4"
          />
          <Label htmlFor="published">Publié</Label>
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement..." : faq ? "Mettre à jour" : "Créer"}
      </Button>
    </form>
  );
}

export function FaqsAdmin({ faqs }: { faqs: Faq[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette FAQ ?")) return;
    await deleteFaq(id);
    toast.success("FAQ supprimée");
    router.refresh();
  }

  return (
    <div>
      <Button onClick={() => setCreating(true)} className="mb-6">
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle FAQ
      </Button>

      {creating && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="mb-4 font-heading font-semibold">Nouvelle FAQ</h3>
            <FaqForm
              onDone={() => {
                setCreating(false);
                router.refresh();
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{faq.question}</p>
                  <span className="text-xs text-muted-foreground">
                    #{faq.order} · {faq.published ? "Publié" : "Brouillon"}
                    {faq.category ? ` · ${faq.category}` : ""}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setEditingId(editingId === faq.id ? null : faq.id)
                  }
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(faq.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
            {editingId === faq.id && (
              <CardContent className="border-t p-6">
                <FaqForm
                  faq={faq}
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
