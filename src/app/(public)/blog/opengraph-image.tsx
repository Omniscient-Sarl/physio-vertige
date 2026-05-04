import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  OgCard,
  loadFonts,
  createOgImage,
} from "@/lib/og-utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blog — Physio-Vertige";

export default async function Image() {
  const fonts = await loadFonts();
  return createOgImage(
    <OgCard
      eyebrow="Blog"
      title="Comprendre les vertiges"
      subtitle="Articles et conseils sur les vertiges et la rééducation vestibulaire"
    />,
    fonts,
  );
}
