"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSiteSettings } from "@/app/admin/_actions/site-settings";

const schema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  contactEmail: z.string().optional(),
  address: z.string().optional(),
  googleVerification: z.string().optional(),
  googleBusinessUrl: z.string().optional(),
  googleReviewCount: z.string().optional(),
  googleAverageRating: z.string().optional(),
  homeHeroImageUrl: z.string().optional(),
  homeAnatomyDiagramUrl: z.string().optional(),
  homeAnatomyCaption: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Settings = {
  siteName: string;
  tagline: string | null;
  phone: string | null;
  email: string | null;
  contactEmail: string | null;
  address: string | null;
  googleVerification: string | null;
  googleBusinessUrl: string | null;
  googleReviewCount: string | number | null;
  googleAverageRating: string | null;
  homeHeroImageUrl: string | null;
  homeAnatomyDiagramUrl: string | null;
  homeAnatomyCaption: string | null;
} | null;

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const [pending, setPending] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      siteName: settings?.siteName ?? "Physio-Vertige",
      tagline: settings?.tagline ?? "",
      phone: settings?.phone ?? "",
      email: settings?.email ?? "",
      contactEmail: settings?.contactEmail ?? "",
      address: settings?.address ?? "",
      googleVerification: settings?.googleVerification ?? "",
      googleBusinessUrl: settings?.googleBusinessUrl ?? "",
      googleReviewCount: settings?.googleReviewCount?.toString() ?? "",
      googleAverageRating: settings?.googleAverageRating ?? "",
      homeHeroImageUrl: settings?.homeHeroImageUrl ?? "",
      homeAnatomyDiagramUrl: settings?.homeAnatomyDiagramUrl ?? "",
      homeAnatomyCaption: settings?.homeAnatomyCaption ?? "",
    },
  });

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = await updateSiteSettings(data);
    if (result.success) toast.success("Paramètres mis à jour");
    else toast.error(result.error ?? "Erreur");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Nom du site</Label>
            <Input id="siteName" {...register("siteName")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" {...register("tagline")} className="mt-1" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" {...register("phone")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email public</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="contactEmail">Email de contact (formulaire)</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea id="address" {...register("address")} className="mt-1" rows={2} />
          </div>
          <div>
            <Label htmlFor="googleVerification">Google verification</Label>
            <Input id="googleVerification" {...register("googleVerification")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="googleBusinessUrl">Google Business URL</Label>
            <Input id="googleBusinessUrl" {...register("googleBusinessUrl")} className="mt-1" placeholder="https://www.google.com/maps/place/..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="googleReviewCount">Nombre d&apos;avis Google</Label>
              <Input id="googleReviewCount" type="number" {...register("googleReviewCount")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="googleAverageRating">Note moyenne Google</Label>
              <Input id="googleAverageRating" {...register("googleAverageRating")} className="mt-1" placeholder="5.0" />
            </div>
          </div>
          <div>
            <Label htmlFor="homeHeroImageUrl">Image hero (accueil)</Label>
            <Input id="homeHeroImageUrl" {...register("homeHeroImageUrl")} className="mt-1" placeholder="URL UploadThing" />
          </div>
          <div>
            <Label htmlFor="homeAnatomyDiagramUrl">Diagramme anatomie (accueil)</Label>
            <Input id="homeAnatomyDiagramUrl" {...register("homeAnatomyDiagramUrl")} className="mt-1" placeholder="URL UploadThing" />
          </div>
          <div>
            <Label htmlFor="homeAnatomyCaption">Légende diagramme anatomie</Label>
            <Input id="homeAnatomyCaption" {...register("homeAnatomyCaption")} className="mt-1" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
