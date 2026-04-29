import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { getSiteSettings, getPublishedServices } from "@/db/queries";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getPublishedServices(),
  ]);

  const phone = settings?.phone ?? "+41 77 274 71 44";
  const email = settings?.email ?? "info@physio-vertige.ch";
  const address = settings?.address ?? "Rue de Couvaloup 16\n1110 Morges";
  const googleMapsUrl =
    settings?.googleMapsUrl ??
    "https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges";
  const footerDescription =
    settings?.footerDescription ??
    "Physiotherapie vestibulaire specialisee a Morges. Traitement des vertiges et troubles de l'equilibre.";
  const footerServiceArea =
    settings?.footerServiceArea ??
    "Morges, Lausanne, Nyon, Vevey, Canton de Vaud";

  const serviceList = services.map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <>
      <Header phone={phone} services={serviceList} />
      <main className="flex-1">{children}</main>
      <Footer
        phone={phone}
        email={email}
        address={address}
        googleMapsUrl={googleMapsUrl}
        footerDescription={footerDescription}
        footerServiceArea={footerServiceArea}
        services={serviceList}
      />
    </>
  );
}
