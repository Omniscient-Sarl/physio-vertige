import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { getSiteSettings } from "@/db/queries";
import { SITE_URL } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const ogImageUrl = settings?.defaultOgImageUrl;
  const ogImageAlt = settings?.defaultOgImageAlt ?? "Physio-Vertige";

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default:
        "Physio-Vertige — Arnaud Canadas, Physiothérapeute vestibulaire à Morges",
      template: "%s | Physio-Vertige",
    },
    description:
      "Physiothérapie vestibulaire à Morges. Arnaud Canadas vous accompagne pour traiter vertiges, troubles de l'équilibre et instabilité. VPPB, rééducation vestibulaire.",
    openGraph: {
      type: "website",
      locale: "fr_CH",
      url: SITE_URL,
      siteName: "Physio-Vertige",
      title: "Physio-Vertige — Physiothérapie vestibulaire à Morges",
      description:
        "Traitement spécialisé des vertiges et troubles de l'équilibre par Arnaud Canadas, physiothérapeute vestibulaire.",
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                alt: ogImageAlt,
                width: 1200,
                height: 630,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: "Physio-Vertige — Physiothérapie vestibulaire à Morges",
      description:
        "Traitement spécialisé des vertiges et troubles de l'équilibre par Arnaud Canadas, physiothérapeute vestibulaire.",
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
    verification: {
      google: "google14c1f8e9a76f78b5",
    },
    alternates: {
      canonical: SITE_URL,
      languages: {
        "fr-CH": SITE_URL,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr-CH"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
