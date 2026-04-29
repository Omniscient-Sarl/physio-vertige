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
import { ImagePicker } from "@/components/admin/image-picker";
import { updateSiteSettings } from "@/app/admin/_actions/site-settings";

const schema = z.object({
  siteName: z.string().min(1),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  contactEmail: z.string().optional(),
  address: z.string().optional(),
  // Contact display
  openingHoursText: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  googleMapsEmbedUrl: z.string().optional(),
  // Footer
  footerDescription: z.string().optional(),
  footerServiceArea: z.string().optional(),
  // Hero
  homeHeroImageUrl: z.string().optional(),
  homeHeroImageAlt: z.string().optional(),
  // Mini-bio
  aboutImageUrl: z.string().optional(),
  aboutImageAlt: z.string().optional(),
  // Anatomy
  homeAnatomyDiagramUrl: z.string().optional(),
  homeAnatomyDiagramAlt: z.string().optional(),
  homeAnatomyCaption: z.string().optional(),
  // SEO & Google
  defaultOgImageUrl: z.string().optional(),
  defaultOgImageAlt: z.string().optional(),
  googleVerification: z.string().optional(),
  googleBusinessUrl: z.string().optional(),
  googleReviewCount: z.string().optional(),
  googleAverageRating: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Settings = Record<string, unknown> | null;

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const [pending, setPending] = useState(false);
  const s = settings ?? {};
  const str = (key: string) => ((s[key] as string) ?? "").toString();

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      siteName: str("siteName") || "Physio-Vertige",
      tagline: str("tagline"),
      phone: str("phone"),
      email: str("email"),
      contactEmail: str("contactEmail"),
      address: str("address"),
      openingHoursText: str("openingHoursText"),
      googleMapsUrl: str("googleMapsUrl"),
      googleMapsEmbedUrl: str("googleMapsEmbedUrl"),
      footerDescription: str("footerDescription"),
      footerServiceArea: str("footerServiceArea"),
      homeHeroImageUrl: str("homeHeroImageUrl"),
      homeHeroImageAlt: str("homeHeroImageAlt"),
      aboutImageUrl: str("aboutImageUrl"),
      aboutImageAlt: str("aboutImageAlt"),
      homeAnatomyDiagramUrl: str("homeAnatomyDiagramUrl"),
      homeAnatomyDiagramAlt: str("homeAnatomyDiagramAlt"),
      homeAnatomyCaption: str("homeAnatomyCaption"),
      defaultOgImageUrl: str("defaultOgImageUrl"),
      defaultOgImageAlt: str("defaultOgImageAlt"),
      googleVerification: str("googleVerification"),
      googleBusinessUrl: str("googleBusinessUrl"),
      googleReviewCount: str("googleReviewCount"),
      googleAverageRating: str("googleAverageRating"),
    },
  });

  const homeHeroImageUrl = watch("homeHeroImageUrl");
  const aboutImageUrl = watch("aboutImageUrl");
  const homeAnatomyDiagramUrl = watch("homeAnatomyDiagramUrl");
  const defaultOgImageUrl = watch("defaultOgImageUrl");

  async function onSubmit(data: FormData) {
    setPending(true);
    const result = await updateSiteSettings(data);
    if (result.success) toast.success("Parametres mis a jour");
    else toast.error(result.error ?? "Erreur");
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Identite</CardTitle>
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
              <Label htmlFor="phone">Telephone</Label>
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
            <Label htmlFor="openingHoursText">Horaires (texte affiche)</Label>
            <Textarea
              id="openingHoursText"
              {...register("openingHoursText")}
              className="mt-1"
              rows={2}
              placeholder={"Lundi - Vendredi : 08h00 - 19h00\nSur rendez-vous uniquement"}
            />
          </div>
          <div>
            <Label htmlFor="googleMapsUrl">Lien Google Maps</Label>
            <Input
              id="googleMapsUrl"
              {...register("googleMapsUrl")}
              className="mt-1"
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
          <div>
            <Label htmlFor="googleMapsEmbedUrl">URL embed Google Maps (iframe)</Label>
            <Input
              id="googleMapsEmbedUrl"
              {...register("googleMapsEmbedUrl")}
              className="mt-1"
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Pied de page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="footerDescription">Description (pied de page)</Label>
            <Textarea
              id="footerDescription"
              {...register("footerDescription")}
              className="mt-1"
              rows={2}
              placeholder="Physiotherapie vestibulaire specialisee a Morges..."
            />
          </div>
          <div>
            <Label htmlFor="footerServiceArea">Zone de couverture</Label>
            <Input
              id="footerServiceArea"
              {...register("footerServiceArea")}
              className="mt-1"
              placeholder="Morges, Lausanne, Nyon, Vevey, Canton de Vaud"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle>Hero (Accueil)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Image hero</Label>
            <ImagePicker
              value={homeHeroImageUrl ?? ""}
              onChange={(v) => setValue("homeHeroImageUrl", v)}
              label="Hero accueil"
            />
          </div>
          <div>
            <Label htmlFor="homeHeroImageAlt">Texte alternatif hero</Label>
            <Input id="homeHeroImageAlt" {...register("homeHeroImageAlt")} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Mini-bio / About */}
      <Card>
        <CardHeader>
          <CardTitle>Mini-bio / Portrait</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Portrait</Label>
            <ImagePicker
              value={aboutImageUrl ?? ""}
              onChange={(v) => setValue("aboutImageUrl", v)}
              label="Portrait"
            />
          </div>
          <div>
            <Label htmlFor="aboutImageAlt">Texte alternatif portrait</Label>
            <Input id="aboutImageAlt" {...register("aboutImageAlt")} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Anatomy */}
      <Card>
        <CardHeader>
          <CardTitle>Section Anatomie (Accueil)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Diagramme anatomie</Label>
            <ImagePicker
              value={homeAnatomyDiagramUrl ?? ""}
              onChange={(v) => setValue("homeAnatomyDiagramUrl", v)}
              label="Anatomie"
            />
          </div>
          <div>
            <Label htmlFor="homeAnatomyDiagramAlt">Texte alternatif diagramme</Label>
            <Input id="homeAnatomyDiagramAlt" {...register("homeAnatomyDiagramAlt")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="homeAnatomyCaption">Legende</Label>
            <Input id="homeAnatomyCaption" {...register("homeAnatomyCaption")} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* SEO & Google */}
      <Card>
        <CardHeader>
          <CardTitle>SEO & Google</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Image OG par defaut</Label>
            <ImagePicker
              value={defaultOgImageUrl ?? ""}
              onChange={(v) => setValue("defaultOgImageUrl", v)}
              label="OG Image"
            />
            <p className="mt-1 text-xs text-muted-foreground">1200 x 630 px recommande. Image affichee lors du partage sur les reseaux sociaux.</p>
          </div>
          <div>
            <Label htmlFor="defaultOgImageAlt">Texte alternatif OG</Label>
            <Input id="defaultOgImageAlt" {...register("defaultOgImageAlt")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="googleVerification">Google verification</Label>
            <Input id="googleVerification" {...register("googleVerification")} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="googleBusinessUrl">Google Business URL</Label>
            <Input
              id="googleBusinessUrl"
              {...register("googleBusinessUrl")}
              className="mt-1"
              placeholder="https://www.google.com/maps/place/..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="googleReviewCount">Nombre d&apos;avis Google</Label>
              <Input
                id="googleReviewCount"
                type="number"
                {...register("googleReviewCount")}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="googleAverageRating">Note moyenne Google</Label>
              <Input
                id="googleAverageRating"
                {...register("googleAverageRating")}
                className="mt-1"
                placeholder="5.0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={pending} size="lg">
        {pending ? "Enregistrement..." : "Enregistrer les parametres"}
      </Button>
    </form>
  );
}
