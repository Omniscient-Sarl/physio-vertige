import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://physio-vertige.ch"),
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
    url: "https://physio-vertige.ch",
    siteName: "Physio-Vertige",
    title: "Physio-Vertige — Physiothérapie vestibulaire à Morges",
    description:
      "Traitement spécialisé des vertiges et troubles de l'équilibre par Arnaud Canadas, physiothérapeute vestibulaire.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Physio-Vertige — Physiothérapie vestibulaire à Morges",
    description:
      "Traitement spécialisé des vertiges et troubles de l'équilibre par Arnaud Canadas, physiothérapeute vestibulaire.",
  },
  verification: {
    google: "google14c1f8e9a76f78b5",
  },
  alternates: {
    canonical: "https://physio-vertige.ch",
    languages: {
      "fr-CH": "https://physio-vertige.ch",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="fr-CH"
        className={`${inter.variable} ${lora.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
