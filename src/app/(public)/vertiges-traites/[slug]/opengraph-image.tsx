import {
  OG_SIZE,
  OG_CONTENT_TYPE,
  OgCard,
  loadFonts,
  createOgImage,
} from "@/lib/og-utils";
import { getServiceBySlug } from "@/db/queries";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const fonts = await loadFonts();

  return createOgImage(
    <OgCard
      eyebrow="Pathologie traitée"
      title={service?.title ?? "Condition vestibulaire"}
      subtitle={service?.heroHook ?? undefined}
    />,
    fonts,
  );
}
