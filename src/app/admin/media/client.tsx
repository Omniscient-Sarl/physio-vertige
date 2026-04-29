"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Copy, ImageIcon, Check, Pencil } from "lucide-react";
import { deleteMedia, createMedia, updateMediaAlt } from "@/app/admin/_actions/media";
import Image from "next/image";

const UploadButton = generateUploadButton<OurFileRouter>();

type MediaItem = {
  id: number;
  uploadthingUrl: string;
  uploadthingKey: string;
  altText: string;
  width: number | null;
  height: number | null;
  uploadedAt: Date;
};

function MediaCard({ item }: { item: MediaItem }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altText, setAltText] = useState(item.altText);
  const [savingAlt, setSavingAlt] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer ce media ?")) return;
    setDeleting(true);
    await deleteMedia(item.id);
    toast.success("Media supprime");
    router.refresh();
  }

  function handleCopy() {
    navigator.clipboard.writeText(item.uploadthingUrl);
    toast.success("URL copiee");
  }

  async function handleSaveAlt() {
    setSavingAlt(true);
    await updateMediaAlt(item.id, altText);
    toast.success("Texte alternatif mis a jour");
    setEditingAlt(false);
    setSavingAlt(false);
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="p-3">
        <div className="relative aspect-video overflow-hidden rounded bg-muted">
          {item.width && item.height ? (
            <Image
              src={item.uploadthingUrl}
              alt={item.altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="mt-2">
          {editingAlt ? (
            <div className="flex gap-1">
              <Input
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="h-7 text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={handleSaveAlt}
                disabled={savingAlt}
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p className="flex-1 truncate text-sm font-medium">
                {item.altText}
              </p>
              <button
                onClick={() => setEditingAlt(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Pencil className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {item.uploadthingKey}
        </p>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="mr-1 h-3 w-3" />
            URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-1 h-3 w-3 text-destructive" />
            {deleting ? "..." : "Supprimer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function MediaAdmin({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <UploadButton
          endpoint="imageUploader"
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={async (res) => {
            setUploading(false);
            if (res?.[0]) {
              const file = res[0];
              const alt = prompt("Texte alternatif pour cette image :") ?? file.name;
              await createMedia({
                uploadthingUrl: file.ufsUrl,
                uploadthingKey: file.key,
                altText: alt,
                width: undefined,
                height: undefined,
              });
              toast.success("Image uploadee");
              router.refresh();
            }
          }}
          onUploadError={(err) => {
            setUploading(false);
            toast.error(err.message);
          }}
          appearance={{
            button:
              "bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 text-sm font-medium",
            allowedContent: "text-xs text-muted-foreground mt-1",
          }}
          content={{
            button: uploading ? "Upload en cours..." : "Uploader une image",
            allowedContent: "Images jusqu'a 8 Mo",
          }}
        />
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Aucun media.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
