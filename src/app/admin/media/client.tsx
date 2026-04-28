"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Copy, ImageIcon } from "lucide-react";
import { deleteMedia } from "@/app/admin/_actions/media";
import Image from "next/image";

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

  async function handleDelete() {
    if (!confirm("Supprimer ce média ?")) return;
    setDeleting(true);
    await deleteMedia(item.id);
    toast.success("Média supprimé");
    router.refresh();
  }

  function handleCopy() {
    navigator.clipboard.writeText(item.uploadthingUrl);
    toast.success("URL copiée");
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
        <p className="mt-2 truncate text-sm font-medium">{item.altText}</p>
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
  return (
    <div>
      <p className="mb-6 text-sm text-muted-foreground">
        Les images sont uploadées via UploadThing. Cette page permet de consulter et supprimer les médias existants.
      </p>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Aucun média.</p>
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
