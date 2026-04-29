"use client";

import { useState } from "react";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const UploadButton = generateUploadButton<OurFileRouter>();

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImagePicker({ value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative inline-block">
          <Image
            src={value}
            alt={label ?? "Image"}
            width={200}
            height={120}
            className="rounded-lg border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL de l'image"
          className="flex-1 text-xs"
        />
        <UploadButton
          endpoint="imageUploader"
          onUploadBegin={() => setUploading(true)}
          onClientUploadComplete={(res) => {
            setUploading(false);
            if (res?.[0]?.ufsUrl) onChange(res[0].ufsUrl);
          }}
          onUploadError={() => setUploading(false)}
          appearance={{
            button: "bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md hover:bg-primary/90",
            allowedContent: "hidden",
          }}
          content={{
            button: uploading ? "Upload..." : "Upload",
          }}
        />
      </div>
    </div>
  );
}
