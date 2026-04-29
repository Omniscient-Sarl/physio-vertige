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
  Loader2,
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

// --- Section type registry ---
// Every section type used in the site, with French labels and typed fields.
type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "image" | "array" | "markdown";
  help?: string;
  rows?: number;
  arrayItemFields?: Array<{ key: string; label: string; type: "text" | "textarea" }>;
};

type SectionTypeDef = {
  label: string;
  fields: FieldDef[];
};

const SECTION_REGISTRY: Record<string, SectionTypeDef> = {
  hero: {
    label: "Hero (en-tete principal)",
    fields: [
      { key: "h1", label: "Titre principal (H1)", type: "text", help: "Unique sur la page, important pour le SEO. Max ~70 caracteres." },
      { key: "subhead", label: "Sous-titre", type: "textarea", rows: 3, help: "Sauts de ligne conserves." },
    ],
  },
  conditions_grid: {
    label: "Grille des conditions",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h2", label: "Titre", type: "text" },
      { key: "body", label: "Texte d'introduction", type: "textarea", rows: 3 },
    ],
  },
  anatomy: {
    label: "Anatomie (oreille interne)",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h2", label: "Titre", type: "text" },
      { key: "body", label: "Corps", type: "textarea", rows: 6, help: "Separez les paragraphes par une ligne vide." },
    ],
  },
  process_timeline: {
    label: "Chronologie du traitement",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h2", label: "Titre", type: "text" },
      {
        key: "steps",
        label: "Etapes",
        type: "array",
        arrayItemFields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  cta_card: {
    label: "Bloc CTA (carte)",
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "description", label: "Description", type: "textarea", rows: 2 },
    ],
  },
  cta_fullwidth: {
    label: "Bloc CTA (pleine largeur)",
    fields: [
      { key: "title", label: "Titre", type: "text" },
      { key: "description", label: "Description", type: "textarea", rows: 2 },
    ],
  },
  testimonials: {
    label: "Section temoignages",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h2", label: "Titre", type: "text" },
    ],
  },
  mini_bio: {
    label: "Mini bio (apercu therapeute)",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h2", label: "Nom", type: "text" },
      { key: "body", label: "Texte de presentation", type: "textarea", rows: 4 },
    ],
  },
  blog_teaser: {
    label: "Apercu blog",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h2", label: "Titre", type: "text" },
    ],
  },
  faq: {
    label: "Section FAQ",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h2", label: "Titre", type: "text" },
    ],
  },
  bio: {
    label: "Biographie complete",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h1", label: "Nom (H1)", type: "text" },
      { key: "subtitle", label: "Sous-titre", type: "text" },
      { key: "body", label: "Texte biographique", type: "textarea", rows: 8, help: "Separez les paragraphes par une ligne vide." },
      {
        key: "qualifications",
        label: "Qualifications",
        type: "array",
        arrayItemFields: [
          { key: "value", label: "Qualification", type: "text" },
        ],
      },
    ],
  },
  contact_hero: {
    label: "En-tete contact",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h1", label: "Titre (H1)", type: "text" },
      { key: "intro", label: "Texte d'introduction", type: "textarea", rows: 3 },
    ],
  },
  cabinet: {
    label: "Presentation du cabinet",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h1", label: "Titre (H1)", type: "text" },
      { key: "body", label: "Description", type: "textarea", rows: 6, help: "Separez les paragraphes par une ligne vide." },
      { key: "linkTitle", label: "Titre du lien externe", type: "text" },
      { key: "linkUrl", label: "URL du lien externe", type: "text", help: "Laissez vide si pas encore disponible." },
    ],
  },
  conditions_list_hero: {
    label: "En-tete liste des conditions",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h1", label: "Titre (H1)", type: "text" },
      { key: "intro", label: "Texte d'introduction", type: "textarea", rows: 3 },
    ],
  },
  blog_list_hero: {
    label: "En-tete liste du blog",
    fields: [
      { key: "eyebrow", label: "Surtitre", type: "text" },
      { key: "h1", label: "Titre (H1)", type: "text" },
      { key: "intro", label: "Texte d'introduction", type: "textarea", rows: 3 },
    ],
  },
  author_bio: {
    label: "Bio auteur (articles de blog)",
    fields: [
      { key: "byline", label: "Fonction courte", type: "text", help: "Ex: Physiotherapeute vestibulaire" },
      { key: "subtitle", label: "Titre complet", type: "text" },
      { key: "body", label: "Biographie courte", type: "textarea", rows: 4 },
    ],
  },
  markdown_body: {
    label: "Contenu Markdown (page legale)",
    fields: [
      { key: "body", label: "Contenu (Markdown)", type: "markdown", rows: 20, help: "Utilisez ## pour les titres, **gras**, *italique*." },
    ],
  },
};

// Build SECTION_TYPES for the dropdown from the registry
const SECTION_TYPES = Object.entries(SECTION_REGISTRY).map(([value, def]) => ({
  value,
  label: def.label,
}));

function sectionTypeLabel(type: string): string {
  return SECTION_REGISTRY[type]?.label ?? type;
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

// --- Character count indicator ---
function CharCount({ value, warn, max }: { value: string; warn: number; max: number }) {
  const len = value.length;
  const color = len > max ? "text-destructive" : len > warn ? "text-yellow-600" : "text-muted-foreground";
  return (
    <span className={`text-xs ${color}`}>
      {len}/{max}
    </span>
  );
}

// --- Array field editor ---
function ArrayFieldEditor({
  value,
  onChange,
  itemFields,
}: {
  value: unknown[];
  onChange: (v: unknown[]) => void;
  itemFields: Array<{ key: string; label: string; type: "text" | "textarea" }>;
}) {
  // For simple arrays (single "value" field like qualifications), items are strings
  const isSimple = itemFields.length === 1 && itemFields[0].key === "value";

  function addItem() {
    if (isSimple) {
      onChange([...value, ""]);
    } else {
      const empty: Record<string, string> = {};
      for (const f of itemFields) empty[f.key] = "";
      onChange([...value, empty]);
    }
  }

  function removeItem(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, updated: unknown) {
    onChange(value.map((v, i) => (i === idx ? updated : v)));
  }

  return (
    <div className="space-y-2">
      {value.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2 rounded-lg border bg-muted/30 p-3">
          <span className="mt-2 text-xs font-medium text-muted-foreground">{idx + 1}.</span>
          <div className="flex-1 space-y-2">
            {isSimple ? (
              <Input
                value={String(item ?? "")}
                onChange={(e) => updateItem(idx, e.target.value)}
              />
            ) : (
              itemFields.map((f) => (
                <div key={f.key}>
                  <Label className="text-xs">{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      value={String((item as Record<string, unknown>)?.[f.key] ?? "")}
                      onChange={(e) =>
                        updateItem(idx, { ...(item as Record<string, unknown>), [f.key]: e.target.value })
                      }
                      className="mt-1 text-sm"
                      rows={2}
                    />
                  ) : (
                    <Input
                      value={String((item as Record<string, unknown>)?.[f.key] ?? "")}
                      onChange={(e) =>
                        updateItem(idx, { ...(item as Record<string, unknown>), [f.key]: e.target.value })
                      }
                      className="mt-1"
                    />
                  )}
                </div>
              ))
            )}
          </div>
          <Button variant="ghost" size="icon" className="mt-1 shrink-0" onClick={() => removeItem(idx)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addItem}>
        <Plus className="mr-1 h-3.5 w-3.5" />
        Ajouter
      </Button>
    </div>
  );
}

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
  const [content, setContent] = useState<Record<string, unknown>>(section.content);
  const [imageUrl, setImageUrl] = useState(section.imageUrl ?? "");

  function set(key: string, value: unknown) {
    setContent((prev) => ({ ...prev, [key]: value }));
  }

  const str = (key: string) => (content[key] as string) ?? "";
  const arr = (key: string) => (content[key] as unknown[]) ?? [];

  const def = SECTION_REGISTRY[section.type];

  if (!def) {
    // Fallback: generic JSON editor
    return (
      <div className="space-y-3">
        <p className="text-xs text-yellow-600">
          Type de section non reconnu : &quot;{section.type}&quot;. Edition JSON brut.
        </p>
        <div>
          <Label>Contenu (JSON)</Label>
          <Textarea
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try { setContent(JSON.parse(e.target.value)); } catch { /* ignore */ }
            }}
            className="mt-1 font-mono text-sm"
            rows={8}
          />
        </div>
        <Button size="sm" disabled={saving} onClick={() => onSave(content, imageUrl || null)}>
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : "Enregistrer la section"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {def.fields.map((field) => {
        if (field.type === "text") {
          return (
            <div key={field.key}>
              <div className="flex items-center justify-between">
                <Label>{field.label}</Label>
                {field.key === "h1" && <CharCount value={str(field.key)} warn={55} max={70} />}
              </div>
              <Input value={str(field.key)} onChange={(e) => set(field.key, e.target.value)} className="mt-1" />
              {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
            </div>
          );
        }
        if (field.type === "textarea" || field.type === "markdown") {
          return (
            <div key={field.key}>
              <Label>{field.label}</Label>
              <Textarea
                value={str(field.key)}
                onChange={(e) => set(field.key, e.target.value)}
                className={`mt-1 ${field.type === "markdown" ? "font-mono text-sm" : ""}`}
                rows={field.rows ?? 4}
              />
              {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
            </div>
          );
        }
        if (field.type === "image") {
          return (
            <div key={field.key}>
              <Label>{field.label}</Label>
              <ImagePicker value={imageUrl} onChange={setImageUrl} label={field.label} />
              {field.help && <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>}
            </div>
          );
        }
        if (field.type === "array" && field.arrayItemFields) {
          return (
            <div key={field.key}>
              <Label>{field.label}</Label>
              <div className="mt-1">
                <ArrayFieldEditor
                  value={arr(field.key)}
                  onChange={(v) => set(field.key, v)}
                  itemFields={field.arrayItemFields}
                />
              </div>
            </div>
          );
        }
        return null;
      })}
      <Button size="sm" disabled={saving} onClick={() => onSave(content, imageUrl || null)}>
        {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</> : "Enregistrer la section"}
      </Button>
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
    if (result.success) toast.success("Modifications enregistrees");
    else toast.error(result.error ?? "Erreur lors de l'enregistrement");
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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
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
  const metaTitle = watch("metaTitle") ?? "";
  const metaDescription = watch("metaDescription") ?? "";

  // Build the public URL for "Voir cette page"
  const publicUrl = page.slug === "/" || page.slug === "" ? "/" : `/${page.slug}`;

  async function onSubmitPage(data: z.infer<typeof pageSchema>) {
    setPagePending(true);
    const result = await updatePage(page.id, data);
    if (result.success) {
      toast.success("Modifications enregistrees");
      setLastSaved(new Date());
    } else {
      toast.error(result.error ?? "Erreur lors de l'enregistrement");
    }
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
      toast.success("Modifications enregistrees");
      setLastSaved(new Date());
    } else {
      toast.error(result.error ?? "Erreur lors de l'enregistrement");
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
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{publicUrl}</span>
            {lastSaved && (
              <span>
                Derniere sauvegarde : {lastSaved.toLocaleTimeString("fr-CH")}
              </span>
            )}
          </div>
        </div>
        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir cette page sur le site
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
              <div className="flex items-center justify-between">
                <Label>Meta titre</Label>
                <CharCount value={metaTitle} warn={55} max={60} />
              </div>
              <Input {...register("metaTitle")} className="mt-1" />
              <p className="mt-1 text-xs text-muted-foreground">
                Apparait dans l&apos;onglet du navigateur et les resultats Google.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label>Meta description</Label>
                <CharCount value={metaDescription} warn={145} max={155} />
              </div>
              <Textarea {...register("metaDescription")} className="mt-1" rows={2} />
              <p className="mt-1 text-xs text-muted-foreground">
                Texte affiche sous le titre dans les resultats Google.
              </p>
            </div>
            <div>
              <Label>Image OG</Label>
              <ImagePicker
                value={ogImageUrl ?? ""}
                onChange={(v) => setValue("ogImageUrl", v)}
                label="OG Image"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                1200 x 630 px recommande. Apparait lors du partage sur les reseaux sociaux.
              </p>
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
              {pagePending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enregistrement...</>
              ) : (
                "Enregistrer les metadonnees"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sections editor */}
      <Card>
        <CardHeader>
          <CardTitle>
            Sections
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({sections.length} section{sections.length !== 1 ? "s" : ""})
            </span>
          </CardTitle>
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
