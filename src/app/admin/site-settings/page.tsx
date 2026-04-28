import { getSiteSettings } from "@/db/queries";
import { SiteSettingsForm } from "./form";

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Paramètres du site</h1>
      <p className="mt-1 text-muted-foreground">
        Configurez les informations globales du site.
      </p>
      <div className="mt-8 max-w-2xl">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
