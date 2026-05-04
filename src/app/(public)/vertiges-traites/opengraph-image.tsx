import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  OgCard,
  loadFonts,
  createOgImage,
} from "@/lib/og-utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Vertiges traités — Physio-Vertige";

export default async function Image() {
  const fonts = await loadFonts();
  return createOgImage(
    <OgCard
      eyebrow="Pathologies vestibulaires"
      title="Vertiges traités"
      subtitle="VPPB, névrite vestibulaire, maladie de Ménière, migraine vestibulaire et plus"
    />,
    fonts,
  );
}
