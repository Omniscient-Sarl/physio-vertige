"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePicker } from "@/components/admin/image-picker";
import {
  ArrowLeft,
  ExternalLink,
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  updatePage,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from "@/app/admin/_actions/pages";

// --- Types ---
type Page = {
  id: number;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImageUrl: string | null;
  status: string;
};

type Section = {
  id: number;
  pageId: number;
  order: number;
  type: string;
  content: Record<string, unknown>;
  imageUrl: string | null;
};

const SECTION_TYPES = [
  { value: "hero", label: "Hero" },
  { value: "text", label: "Texte" },
  { value: "image", label: "Image" },
  { value: "image_text", label: "Image + Texte" },
  { value: "cta", label: "Appel a l'action (CTA)" },
  { value: "gallery", label: "Galerie" },
  { value: "services_grid", label: "Grille de services" },
  { value: "testimonials_block", label: "Bloc temoignages" },
  { value: "faq_block", label: "Bloc FAQ" },
  { value: "anatomy", label: "Anatomie" },
] as const;

function sectionTypeLabel(type: string): string {
  return SECTION_TYPES.find((t) => t.value === type)?.label ?? type;
}

// --- Page meta form schema ---
const pageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

// --- Section form for each type ---
function SectionForm({
  section,
  onSave,
  saving,
}: {
  section: Section;
  onSave: (content: Record<string, unknown>, imageUrl: string | null) => void;
  saving: boolean;
}) {
  const c = section.content;
  const [content, setContent] = useState<Record<string, unknown>>(c);
  const [imageUrl, setImageUrl] = useState(section.imageUrl ?? "");

  function set(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  const str = (key: string) => (content[key] as string) ?? "";

  const fields: Record<string, React.ReactNode> = {
    hero: (
      <>
        <Field label="Surtitre" value={str("eyebrow")} onChange={(v) => set("eyebrow", v)} />
        <Field label="Titre (H1)" value={str("h1")} onChange={(v) => set("h1", v)} />
        <Field label="Sous-titre" value={str("subtitle")} onChange={(v) => set("subtitle", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Texte CTA" value={str("ctaLabel")} onChange={(v) => set("ctaLabel", v)} />
          <Field label="URL CTA" value={str("ctaUrl")} onChange={(v) => set("ctaUrl", v)} />
        </div>
        <div>
          <Label>Image hero</Label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} label="Hero" />
        </div>
      </>
    ),
    text: (
      <>
        <Field label="Titre" value={str("title")} onChange={(v) => set("title", v)} />
        <FieldTextarea label="Contenu (Markdown)" value={str("body")} onChange={(v) => set("body", v)} rows={8} />
      </>
    ),
    image: (
      <>
        <div>
          <Label>Image</Label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} label="Image" />
        </div>
        <Field label="Texte alternatif" value={str("alt")} onChange={(v) => set("alt", v)} />
        <Field label="Legende" value={str("caption")} onChange={(v) => set("caption", v)} />
      </>
    ),
    image_text: (
      <>
        <Field label="Titre" value={str("title")} onChange={(v) => set("title", v)} />
        <FieldTextarea label="Contenu (Markdown)" value={str("body")} onChange={(v) => set("body", v)} rows={6} />
        <div>
          <Label>Image</Label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} label="Image" />
        </div>
        <Field label="Texte alternatif" value={str("alt")} onChange={(v) => set("alt", v)} />
        <div>
          <Label>Position image</Label>
          <select
            value={str("imagePosition") || "right"}
            onChange={(e) => set("imagePosition", e.target.value)}
            className="mt-1 flex h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
          >
            <option value="left">Gauche</option>
            <option value="right">Droite</option>
          </select>
        </div>
      </>
    ),
    cta: (
      <>
        <Field label="Titre" value={str("title")} onChange={(v) => set("title", v)} />
        <Field label="Description" value={str("description")} onChange={(v) => set("description", v)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Texte bouton principal" value={str("primaryLabel")} onChange={(v) => set("primaryLabel", v)} />
          <Field label="URL bouton principal" value={str("primaryUrl")} onChange={(v) => set("primaryUrl", v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Texte bouton secondaire" value={str("secondaryLabel")} onChange={(v) => set("secondaryLabel", v)} />
          <Field label="URL bouton secondaire" value={str("secondaryUrl")} onChange={(v) => set("secondaryUrl", v)} />
        </div>
      </>
    ),
    gallery: (
      <>
        <Field label="Titre" value={str("title")} onChange={(v) => set("title", v)} />
        <FieldTextarea
          label="URLs images (une par ligne)"
          value={str("images")}
          onChange={(v) => set("images", v)}
          rows={4}
        />
      </>
    ),
    services_grid: (
      <>
        <Field label="Titre" value={str("title")} onChange={(v) => set("title", v)} />
        <Field label="Description" value={str("description")} onChange={(v) => set("description", v)} />
      </>
    ),
    testimonials_block: (
      <>
        <Field label="Titre" value={str("title")} onChange={(v) => set("title", v)} />
      </>
    ),
    faq_block: (
      <>
        <Field label="Titre" value={str("title")} onChange={(v) => set("title", v)} />
        <Field label="Categorie (filtre)" value={str("category")} onChange={(v) => set("category", v)} />
      </>
    ),
    anatomy: (
      <>
        <Field label="Surtitre" value={str("eyebrow")} onChange={(v) => set("eyebrow", v)} />
        <Field label="Titre (H2)" value={str("h2")} onChange={(v) => set("h2", v)} />
        <FieldTextarea label="Corps" value={str("body")} onChange={(v) => set("body", v)} rows={4} />
        <div>
          <Label>Diagramme</Label>
          <ImagePicker value={imageUrl} onChange={setImageUrl} label="Diagramme" />
        </div>
        <Field label="Legende" value={str("caption")} onChange={(v) => set("caption", v)} />
      </>
    ),
  };

  return (
    <div className="space-y-3">
      {fields[section.type] ?? (
        <FieldTextarea
          label="Contenu (JSON)"
          value={JSON.stringify(content, null, 2)}
          onChange={(v) => {
            try { setContent(JSON.parse(v)); } catch { /* ignore */ }
          }}
          rows={6}
        />
      )}
      <Button
        size="sm"
        disabled={saving}
        onClick={() => onSave(content, imageUrl || null)}
      >
        {saving ? "Enregistrement..." : "Enregistrer la section"}
      </Button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 font-mono text-sm"
        rows={rows}
      />
    </div>
  );
}

// --- Sortable section card ---
function SortableSectionCard({
  section,
  onDelete,
  onSave,
}: {
  section: Section;
  onDelete: () => void;
  onSave: (content: Record<string, unknown>, imageUrl: string | null) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  async function handleSave(content: Record<string, unknown>, imageUrl: string | null) {
    setSaving(true);
    const result = await updateSection(section.id, {
      type: section.type,
      content,
      imageUrl,
    });
    if (result.success) toast.success("Section enregistree");
    else toast.error(result.error ?? "Erreur");
    setSaving(false);
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={isDragging ? "ring-2 ring-primary" : ""}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex flex-1 items-center gap-2 text-left"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="font-medium">
                {sectionTypeLabel(section.type)}
              </span>
              <span className="text-xs text-muted-foreground">
                #{section.order}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (confirm("Supprimer cette section ?")) onDelete();
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          {expanded && (
            <div className="mt-4 border-t pt-4">
              <SectionForm
                section={section}
                onSave={onSave || handleSave}
                saving={saving}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main page editor ---
export function PageEditor({
  page,
  sections: initialSections,
}: {
  page: Page;
  sections: Section[];
}) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [pagePending, setPagePending] = useState(false);
  const [addingType, setAddingType] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page.title,
      slug: page.slug,
      metaTitle: page.metaTitle ?? "",
      metaDescription: page.metaDescription ?? "",
      ogImageUrl: page.ogImageUrl ?? "",
      status: page.status as "draft" | "published",
    },
  });

  const ogImageUrl = watch("ogImageUrl");

  async function onSubmitPage(data: z.infer<typeof pageSchema>) {
    setPagePending(true);
    const result = await updatePage(page.id, data);
    if (result.success) toast.success("Page mise a jour");
    else toast.error(result.error ?? "Erreur");
    setPagePending(false);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const newSections = arrayMove(sections, oldIndex, newIndex);
    setSections(newSections);

    await reorderSections(
      page.id,
      newSections.map((s) => s.id)
    );
    toast.success("Ordre mis a jour");
  }

  async function handleAddSection() {
    if (!addingType) return;
    const result = await createSection(page.id, {
      type: addingType,
      content: {},
      imageUrl: null,
    });
    if (result.success && result.id) {
      setSections((prev) => [
        ...prev,
        {
          id: result.id!,
          pageId: page.id,
          order: prev.length,
          type: addingType,
          content: {},
          imageUrl: null,
        },
      ]);
      setAddingType("");
      toast.success("Section ajoutee");
    } else {
      toast.error(result.error ?? "Erreur");
    }
  }

  async function handleDeleteSection(id: number) {
    await deleteSection(id);
    setSections((prev) => prev.filter((s) => s.id !== id));
    toast.success("Section supprimee");
  }

  async function handleSaveSection(
    id: number,
    content: Record<string, unknown>,
    imageUrl: string | null
  ) {
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    const result = await updateSection(id, {
      type: section.type,
      content,
      imageUrl,
    });
    if (result.success) {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, content, imageUrl } : s))
      );
      toast.success("Section enregistree");
    } else {
      toast.error(result.error ?? "Erreur");
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/pages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold">{page.title}</h1>
          <p className="text-sm text-muted-foreground">/{page.slug}</p>
        </div>
        <a
          href={`/${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir sur le site
          </Button>
        </a>
      </div>

      {/* Page metadata form */}
      <Card>
        <CardHeader>
          <CardTitle>Metadonnees de la page</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitPage)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Titre</Label>
                <Input {...register("title")} className="mt-1" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input {...register("slug")} className="mt-1" />
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
              <Label>Image OG</Label>
              <ImagePicker
                value={ogImageUrl ?? ""}
                onChange={(v) => setValue("ogImageUrl", v)}
                label="OG Image"
              />
            </div>
            <div>
              <Label>Statut</Label>
              <select
                {...register("status")}
                className="mt-1 flex h-8 w-full rounded-lg border bg-background px-2.5 text-sm"
              >
                <option value="published">Publie</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
            <Button type="submit" disabled={pagePending}>
              {pagePending ? "Enregistrement..." : "Enregistrer les metadonnees"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sections editor */}
      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSectionCard
                  key={section.id}
                  section={section}
                  onDelete={() => handleDeleteSection(section.id)}
                  onSave={(content, imageUrl) =>
                    handleSaveSection(section.id, content, imageUrl)
                  }
                />
              ))}
            </SortableContext>
          </DndContext>

          {sections.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Aucune section. Ajoutez-en une ci-dessous.
            </p>
          )}

          {/* Add section */}
          <div className="flex items-center gap-2 border-t pt-4">
            <select
              value={addingType}
              onChange={(e) => setAddingType(e.target.value)}
              className="flex h-8 flex-1 rounded-lg border bg-background px-2.5 text-sm"
            >
              <option value="">Choisir un type de section...</option>
              {SECTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              disabled={!addingType}
              onClick={handleAddSection}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
